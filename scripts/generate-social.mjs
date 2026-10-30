import { readFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
const moduleArg = process.argv.indexOf('--playwright')
const { chromium } = await import(
  moduleArg >= 0
    ? pathToFileURL(process.argv[moduleArg + 1]).href
    : 'playwright'
)
const font = (
  await readFile(
    new URL('../public/fonts/manrope-latin-variable.woff2', import.meta.url),
  )
).toString('base64')
const loop = (
  await readFile(new URL('../public/artwork/loop.svg', import.meta.url))
).toString('base64')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  await page.setContent(
    `<style>@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f7f8f2;color:#20271f;font-family:Manrope,Arial,sans-serif;padding:60px 64px}.brand{font-size:30px;font-weight:600;letter-spacing:-1px}.copy{position:relative;z-index:1;margin-top:68px}h1{font-size:68px;font-weight:500;line-height:1.14;letter-spacing:-4px;margin:0}h1 span{color:#315c3d}p{font-size:20px;color:#626b61;line-height:1.6;margin:24px 0 0}.handle{position:absolute;bottom:54px;font-size:17px}img{position:absolute;right:4px;top:90px;width:545px;height:477px}.rule{width:100%;height:1px;background:#d9dfd2;margin-top:24px}</style><div class="brand">kaito.</div><div class="rule"></div><img src="data:image/svg+xml;base64,${loop}"/><div class="copy"><h1>A human touch.<br/><span>An onchain world.</span></h1><p>Independent designer & developer<br/>creating thoughtful Web3 experiences.</p></div><div class="handle">@kaito19_8</div>`,
  )
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({
    path: fileURLToPath(new URL('../public/social-card.png', import.meta.url)),
  })
  console.log('Generated public/social-card.png (1200 × 630)')
} finally {
  await browser.close()
}
