# Kaito portfolio

A minimalist, responsive Web3 freelancer portfolio for **@kaito19_8**, built with React, TypeScript, and Vite. Includes original local artwork, project-detail dialogs, skills, social links, and a contact form that prepares a message for an explicit handoff to X.

**The finished static site is in `dist/`.** It is delivered alongside its source, package lockfile, local font, favicon, and 1200 × 630 share image. All exported asset paths are relative and the page uses hash navigation, so it works from a static-host subpath without server rewrites.

## Install, run, and rebuild

Use Node.js 22.12+ (or a compatible Node 20.19+ release) and npm.

```sh
npm ci
npm run dev
```

Production checks and preview:

```sh
npm run typecheck
npm run build
npm run preview
```

Open the local URL printed by Vite. For deployment, serve the **contents of `dist/`**. The export already exists; hosting does not need to rebuild it. Dependencies, caches, scratch output, and browser logs are ignored; `dist/` and review artifacts are explicitly included. See [the path budget](artifacts/path-budget.md).

## Content and contact behavior

- Project data, descriptions, scope, and skills are in `src/content.ts`. Orbit and Forma are clearly labeled **self-initiated concept work**; no client history or real deployed applications were provided. Replace them with the owner’s real case studies as available.
- Page copy and navigation are in `src/App.tsx`; form behavior is in `src/components/ContactForm.tsx`. The name Kaito is inferred from the supplied handle. No additional social identities are invented.
- The form validates a required name/project description and an optional email, then prepares a message in browser memory. Visitors can copy it, open `https://x.com/kaito19_8`, and send it privately themselves. It does **not** send email or submit to a backend, and it never claims delivery. X access and direct-message availability depend on X and the account’s settings. A manual copy and text download remain available if clipboard access fails.
- Fields survive “Edit message” but clear on reload. No analytics, cookies, wallet code, browser storage, or third-party runtime requests are included. Opening X is an explicit visitor action.
- Design tokens, typography, components, and breakpoints are documented in [DESIGN.md](DESIGN.md).

The SVG artwork is already bundled. To regenerate it, run `python3 scripts/generate-art.py` (Python standard library). To regenerate the share image, install Chromium with Playwright, run `node scripts/generate-social.mjs`, then rebuild. Keep `public/fonts/OFL.txt` with the font.

## Interaction validation

The reusable checker serves only the production export under `/preview/`, runs browser interactions and axe audits, and closes its server and browsers on completion:

```sh
npx playwright install chromium webkit
npm run build
npm run validate
```

Browser system libraries may also be needed by the local OS. The checker requires Chromium and records an explicit limitation when WebKit cannot launch. It writes results and screenshots to `test/scratch/validation/`, which is not submitted. It does not send messages or follow social links.

## Results from this build

Checked on **2026-10-30**:

| Check | Actual result |
| --- | --- |
| `npm run typecheck` | Passed, exit 0 |
| `npm run build` | Passed, exit 0; Vite 7.3.7 |
| Normal-config reproducibility | Isolated clean source copy built with the ordinary scripts; `diff -rq` against delivered `dist/` found no differences |
| Interaction validation | 21 Chromium checks passed at 320, 390, 768, and 1440px |
| Accessibility automation | Four axe state audits, zero violations; manual-review contrast candidates are documented |
| Pinned taste@1 probe, offline | 16/16 passed; no overflow, script errors, or missing resources |
| Dependency audit | `npm audit`: zero vulnerabilities at the time of this run |
| Better Interface review | All six domains reviewed; applicable findings fixed and rechecked |

To keep installed dependencies out of the submission, dependencies were installed in an isolated temporary working copy. The ordinary `npm run typecheck` and `npm run build` commands ran there with the delivered configuration, and their export matched this repository byte for byte. Interaction checks and the pinned design probe also ran against this repository’s export. Generated tool caches are ignored. Temporary tooling overrides are not build dependencies or deliverables.

**Limitations:** WebKit was downloaded but could not launch because the machine lacks its required shared libraries. No Safari, physical-device, screen-reader, or native browser-zoom verification is claimed. A 200% text enlargement/reflow check passed; that is distinct from browser-native zoom. Artwork lettering and the two decorative desktop art captions are outside the probe’s fully automatic contrast coverage. X message delivery is a deliberate external handoff, not a tested backend.

See [the complete validation record](artifacts/validation.md), [machine-readable interaction results](artifacts/interaction-results.json), and [design probe results](artifacts/taste-summary.json). Selected final screenshots are retained in `artifacts/screenshots/`. These are worker-side results, not independent certification.

Design guidance and font attribution are retained in [license notices](artifacts/licenses/NOTICE.md).
