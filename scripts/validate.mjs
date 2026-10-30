import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

// Serve only the production export, under a subpath. No dev server or external services.
const option = (name) => {
  const index = process.argv.indexOf(name)
  return index < 0 ? null : process.argv[index + 1]
}
const { chromium, webkit } = await import(
  option('--playwright')
    ? pathToFileURL(option('--playwright')).href
    : 'playwright'
)
const { default: AxeBuilder } = await import(
  option('--axe') ? pathToFileURL(option('--axe')).href : '@axe-core/playwright'
)
const out = resolve(option('--out') || 'test/scratch/validation')
const root = resolve('dist')
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}
const report = {
  started: new Date().toISOString(),
  engines: [],
  checks: [],
  contrast: [],
  limitations: [],
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    const path = resolve(
      root,
      decodeURIComponent(url.pathname).replace(/^\/preview\//, '') ||
        'index.html',
    )
    if (!url.pathname.startsWith('/preview/') || !path.startsWith(root + sep)) {
      res.writeHead(404)
      res.end()
      return
    }
    const file = await readFile(path)
    res.writeHead(200, {
      'Content-Type': mime[extname(path)] || 'application/octet-stream',
    })
    res.end(file)
  } catch {
    res.writeHead(404)
    res.end()
  }
})
await mkdir(out, { recursive: true })
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const url = `http://127.0.0.1:${server.address().port}/preview/`
async function check(name, work) {
  await work()
  report.checks.push({ name, passed: true })
  console.log(`PASS ${name}`)
}
async function audit(page, name) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  await writeFile(
    resolve(out, `axe-${name}.json`),
    JSON.stringify(
      { violations: result.violations, incomplete: result.incomplete },
      null,
      2,
    ),
  )
  assert.deepEqual(
    result.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`,
    ),
    [],
    `axe violations in ${name}`,
  )
}
let fatal
try {
  for (const [name, engine] of [
    ['chromium', chromium],
    ['webkit', webkit],
  ]) {
    let browser
    try {
      browser = await engine.launch({ headless: true })
    } catch (error) {
      if (name === 'chromium') throw error
      report.limitations.push(
        `WebKit could not launch: ${String(error.message).split('\n').slice(0, 4).join(' ')}`,
      )
      console.log('LIMITATION WebKit could not launch; see results.json')
      continue
    }
    report.engines.push(name)
    try {
      const context = await browser.newContext({
        reducedMotion: 'reduce',
        acceptDownloads: true,
      })
      const page = await context.newPage()
      const errors = [],
        failed = [],
        external = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('requestfailed', (r) =>
        failed.push(`${r.url()}: ${r.failure()?.errorText}`),
      )
      page.on('response', (r) => {
        if (r.status() >= 400) failed.push(`${r.url()}: ${r.status()}`)
      })
      page.on('request', (r) => {
        if (!r.url().startsWith(url) && !r.url().startsWith('data:'))
          external.push(r.url())
      })
      await page.goto(url)
      await page.evaluate(() => document.fonts.ready)
      for (const width of [320, 390, 768, 1440]) {
        await check(`${name}: layout ${width}px`, async () => {
          await page.setViewportSize({
            width,
            height: width > 1000 ? 1000 : 844,
          })
          await page.evaluate(() => scrollTo(0, 0))
          assert.ok(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            'horizontal overflow',
          )
          assert.ok(
            await page.evaluate(() => document.fonts.check('500 46px Manrope')),
            'local font not loaded',
          )
          if (width === 390) {
            const action = await page
              .getByRole('link', { name: 'Get in touch', exact: true })
              .boundingBox()
            assert.ok(
              action && action.y >= 0 && action.y + action.height < 844,
              'primary action below first screen',
            )
            const heading = await page.locator('h1').boundingBox()
            assert.ok(heading && heading.y + heading.height < 844)
          }
          await page.screenshot({
            path: resolve(out, `${name}-${width}.png`),
            fullPage: width === 1440,
          })
        })
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await check(`${name}: main page accessibility audit`, () =>
        audit(page, `${name}-main`),
      )
      await check(`${name}: rendered text and control contrast`, async () => {
        const pairs = await page.evaluate(() => {
          function rgb(value) {
            return value
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
          }
          function luminance(color) {
            return rgb(color)
              .map((c) => {
                const v = c / 255
                return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
              })
              .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
          }
          function pair(label, fg, bg, minimum) {
            const levels = [luminance(fg), luminance(bg)].sort((a, b) => a - b)
            return {
              label,
              foreground: fg,
              background: bg,
              ratio: Number(
                ((levels[1] + 0.05) / (levels[0] + 0.05)).toFixed(2),
              ),
              minimum,
            }
          }
          const root = getComputedStyle(document.documentElement),
            note = getComputedStyle(document.querySelector('.hero-note')),
            input = document.querySelector('#contact-name'),
            inputStyle = getComputedStyle(input),
            contact = getComputedStyle(
              document.querySelector('.contact-section'),
            ),
            button = getComputedStyle(
              document.querySelector('.hero-actions .button-primary'),
            )
          return [
            pair('Body text / page', root.color, root.backgroundColor, 4.5),
            pair(
              'Secondary text / page',
              note.color,
              root.backgroundColor,
              4.5,
            ),
            pair(
              'Placeholder / contact surface',
              getComputedStyle(input, '::placeholder').color,
              contact.backgroundColor,
              4.5,
            ),
            pair(
              'Primary button text / fill',
              button.color,
              button.backgroundColor,
              4.5,
            ),
            pair(
              'Input boundary / contact surface',
              inputStyle.borderTopColor,
              contact.backgroundColor,
              3,
            ),
            pair(
              'Focus ring / page',
              button.backgroundColor,
              root.backgroundColor,
              3,
            ),
            pair(
              'Focus ring / contact surface',
              button.backgroundColor,
              contact.backgroundColor,
              3,
            ),
          ]
        })
        for (const pair of pairs)
          assert.ok(pair.ratio >= pair.minimum, `${pair.label}: ${pair.ratio}`)
        report.contrast.push(
          ...pairs.map((pair) => ({ engine: name, ...pair })),
        )
      })
      await check(`${name}: keyboard navigation and skip link`, async () => {
        await page.goto(url)
        await page.keyboard.press('Tab')
        assert.equal(
          await page.evaluate(() => document.activeElement.textContent),
          'Skip to content',
        )
        const style = await page.locator('.skip-link').evaluate((e) => ({
          outline: getComputedStyle(e).outlineStyle,
          top: e.getBoundingClientRect().top,
        }))
        assert.equal(style.outline, 'solid')
        assert.ok(style.top >= 0)
        await page.keyboard.press('Enter')
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          'main',
        )
      })
      await check(`${name}: anchor navigation`, async () => {
        for (const [label, hash] of [
          ['Work', '#work'],
          ['About', '#about'],
          ['Get in touch', '#contact'],
        ]) {
          await page.getByRole('link', { name: label, exact: true }).click()
          assert.equal(new URL(page.url()).hash, hash)
          assert.ok(
            await page.locator(hash).evaluate((e) => {
              const r = e.getBoundingClientRect()
              return r.top >= -2 && r.top < innerHeight
            }),
          )
        }
        await page
          .getByRole('link', { name: 'Back to top', exact: true })
          .click()
        assert.equal(await page.evaluate(() => scrollY), 0)
      })
      await check(
        `${name}: both project dialogs, focus trap, Escape and focus return`,
        async () => {
          for (const project of ['Orbit', 'Forma']) {
            const trigger = page.getByRole('button', {
              name: `View ${project} project`,
              exact: true,
            })
            await trigger.focus()
            await page.keyboard.press('Enter')
            await page.getByRole('dialog').waitFor({ state: 'visible' })
            assert.equal(
              await page
                .getByRole('dialog')
                .getByRole('heading', { level: 2 })
                .textContent(),
              project,
            )
            assert.ok(
              await page.evaluate(() =>
                document
                  .querySelector('dialog')
                  .contains(document.activeElement),
              ),
            )
            for (let i = 0; i < 5; i++) {
              await page.keyboard.press('Tab')
              assert.ok(
                await page.evaluate(() =>
                  document
                    .querySelector('dialog')
                    .contains(document.activeElement),
                ),
              )
            }
            await page.screenshot({
              path: resolve(out, `${name}-${project.toLowerCase()}-dialog.png`),
            })
            if (project === 'Orbit') await audit(page, `${name}-dialog`)
            await page.keyboard.press('Escape')
            assert.equal(
              await page.locator('dialog').evaluate((e) => e.open),
              false,
            )
            assert.ok(
              await trigger.evaluate((e) => e === document.activeElement),
              'focus did not return to project trigger',
            )
          }
        },
      )
      await check(`${name}: project CTA reaches contact`, async () => {
        await page.getByRole('button', { name: 'View Orbit project' }).click()
        await page
          .getByRole('link', { name: 'Discuss a similar project' })
          .click()
        assert.equal(new URL(page.url()).hash, '#contact')
        assert.equal(
          await page.locator('dialog').evaluate((e) => e.open),
          false,
        )
      })
      await check(`${name}: dialog close button and backdrop`, async () => {
        await page.getByRole('button', { name: 'View Forma project' }).click()
        await page.getByRole('button', { name: 'Close project' }).click()
        assert.equal(
          await page.locator('dialog').evaluate((e) => e.open),
          false,
        )
        await page.getByRole('button', { name: 'View Forma project' }).click()
        await page.mouse.click(4, 4)
        assert.equal(
          await page.locator('dialog').evaluate((e) => e.open),
          false,
        )
      })
      const nameField = page.getByLabel('Your name'),
        emailField = page.getByLabel('Email'),
        message = page.getByLabel('What are you working on?')
      await check(`${name}: contact validation and recovery`, async () => {
        await page.getByRole('button', { name: 'Prepare message' }).click()
        assert.equal(await nameField.getAttribute('aria-invalid'), 'true')
        await page.waitForFunction(
          () => document.activeElement.id === 'contact-name',
        )
        assert.equal(await message.getAttribute('aria-invalid'), 'true')
        await nameField.fill('Alex Chen')
        await emailField.fill('incomplete')
        await message.fill(
          'A responsive site for our onchain community. We would like help with design and development.',
        )
        await page.getByRole('button', { name: 'Prepare message' }).click()
        assert.equal(await emailField.getAttribute('aria-invalid'), 'true')
        await page.waitForFunction(
          () => document.activeElement.id === 'contact-email',
        )
        await audit(page, `${name}-form-errors`)
        await emailField.fill('alex@example.com')
        await message.focus()
        await page.keyboard.press('Control+Enter')
        await page
          .getByRole('heading', { name: 'Your message is ready' })
          .waitFor({ state: 'visible' })
        await page.waitForFunction(
          () => document.activeElement.textContent === 'Your message is ready',
        )
        assert.match(
          await page.getByLabel('Prepared message').inputValue(),
          /Alex Chen[\s\S]*alex@example.com/,
        )
        await audit(page, `${name}-message-ready`)
      })
      if (name === 'chromium') {
        await check('chromium: clipboard success', async () => {
          await context.grantPermissions(['clipboard-read', 'clipboard-write'])
          await page
            .getByRole('button', { name: 'Copy message', exact: true })
            .click()
          await page
            .getByRole('status')
            .getByText(/Message copied/)
            .waitFor()
          assert.match(
            await page.evaluate(() => navigator.clipboard.readText()),
            /Alex Chen/,
          )
        })
      }
      await check(`${name}: clipboard failure is recoverable`, async () => {
        await page.evaluate(() => {
          Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
              writeText: async () => {
                throw new Error('Clipboard denied for validation')
              },
            },
          })
        })
        await page
          .getByRole('button', { name: 'Copy message', exact: true })
          .click()
        await page
          .getByRole('status')
          .getByText(/Clipboard is unavailable/)
          .waitFor()
        await page.screenshot({
          path: resolve(out, `${name}-message-ready.png`),
        })
      })
      await check(
        `${name}: message download contains prepared text`,
        async () => {
          const pending = page.waitForEvent('download')
          await page.getByRole('button', { name: 'Download as text' }).click()
          const download = await pending
          assert.equal(download.suggestedFilename(), 'message-for-kaito.txt')
          const text = await readFile(await download.path(), 'utf8')
          assert.match(text, /Alex Chen[\s\S]*alex@example.com/)
        },
      )
      await check(
        `${name}: edit preserves input, optional email can be omitted`,
        async () => {
          await page.getByRole('button', { name: 'Edit message' }).click()
          assert.equal(await nameField.inputValue(), 'Alex Chen')
          await page.waitForFunction(
            () => document.activeElement.id === 'contact-name',
          )
          await emailField.fill('')
          await page.getByRole('button', { name: 'Prepare message' }).click()
          assert.doesNotMatch(
            await page.getByLabel('Prepared message').inputValue(),
            /reach me at/,
          )
          await page.getByRole('button', { name: 'Edit message' }).click()
        },
      )
      await check(`${name}: social links and share assets`, async () => {
        for (const link of await page.locator('a[href^="https:"]').all()) {
          assert.equal(
            await link.getAttribute('href'),
            'https://x.com/kaito19_8',
          )
          assert.equal(await link.getAttribute('target'), '_blank')
          assert.match(await link.getAttribute('rel'), /noopener/)
        }
        for (const selector of [
          'link[rel="icon"]',
          'meta[property="og:image"]',
        ]) {
          const src = await page
            .locator(selector)
            .getAttribute(selector.startsWith('link') ? 'href' : 'content')
          assert.ok(src.startsWith('./'))
          assert.equal(
            (await context.request.get(new URL(src, url).href)).status(),
            200,
          )
        }
      })
      await check(`${name}: reduced motion`, async () => {
        assert.equal(
          await page.evaluate(
            () => matchMedia('(prefers-reduced-motion: reduce)').matches,
          ),
          true,
        )
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).scrollBehavior,
          ),
          'auto',
        )
        assert.equal(
          await page.evaluate(
            () =>
              document.getAnimations().filter((a) => a.playState === 'running')
                .length,
          ),
          0,
        )
      })
      await check(`${name}: 200% text enlargement reflow`, async () => {
        await page.evaluate(
          () => (document.documentElement.style.fontSize = '200%'),
        )
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          'text enlargement overflow',
        )
        await page.screenshot({
          path: resolve(out, `${name}-text-200.png`),
          fullPage: true,
        })
        await page.evaluate(
          () => (document.documentElement.style.fontSize = ''),
        )
      })
      await check(`${name}: RTL mirror and forced colors`, async () => {
        await page.evaluate(() => (document.documentElement.dir = 'rtl'))
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        await page.screenshot({ path: resolve(out, `${name}-rtl.png`) })
        await page.evaluate(() => (document.documentElement.dir = 'ltr'))
        await page.emulateMedia({ forcedColors: 'active' })
        await nameField.focus()
        const border = await nameField.evaluate(
          (e) => getComputedStyle(e).borderTopStyle,
        )
        assert.equal(border, 'solid')
        await page.screenshot({
          path: resolve(out, `${name}-forced-colors.png`),
        })
        await page.emulateMedia({ forcedColors: 'none' })
      })
      await check(
        `${name}: no script errors, failed resources, or external requests`,
        async () => {
          assert.deepEqual(errors, [])
          assert.deepEqual(failed, [])
          assert.deepEqual(external, [])
        },
      )
      await context.close()
    } finally {
      await browser.close()
    }
  }
} catch (error) {
  fatal = error
  report.failure = error.stack
  console.error(error)
} finally {
  server.close()
  await writeFile(resolve(out, 'results.json'), JSON.stringify(report, null, 2))
}
if (fatal) process.exitCode = 1
