# Kaito design system

## Overview

A single-page portfolio for an independent Web3 designer and frontend developer. Its visual idea is a calm editorial page with a green interlocking sculpture: connection expressed through one original illustration, generous space, and precise type. Project artwork supplies additional color; the interface stays warm off-white, charcoal, and forest green.

The implemented sources are `src/styles.css`, `src/App.tsx`, `src/content.ts`, and `src/components/`. Project content is explicitly presented as self-initiated concepts. No client history, performance metrics, wallet connection, or deployed products are implied.

## Colors

The canonical format is sRGB hex. The primitive palette and semantic mappings live in `src/styles.css:9`. Components consume semantic tokens.

| Semantic token | Value | Use |
| --- | --- | --- |
| `--color-page` | `#f7f8f2` | Page, project dialog, prepared message |
| `--color-surface` | `#ffffff` | Skip-link surface |
| `--color-surface-soft` | `#edf0e6` | Contact section |
| `--color-text` | `#20271f` | Headings, primary text, icons |
| `--color-text-secondary` | `#626b61` | Descriptions, labels, placeholders, tags |
| `--color-border` | `#d9dfd2` | Quiet separators and noninteractive tags |
| `--color-input-border` | `#7d8777` | Form boundaries and outlined actions |
| `--color-accent`, `--color-focus` | `#315c3d` | Primary actions, brand emphasis, focus ring |
| `--color-accent-hover` | `#24472e` | Primary action hover |
| `--color-accent-soft` | `#e7eddf` | Subtle hover backgrounds, project fallback |
| `--color-on-accent` | `#ffffff` | Primary button text and selection text |
| `--color-error` | `#a33631` | Field error text and boundary |

The dialog backdrop is `#1723189e`. Illustration colors are local to SVG artwork, not additional interface status colors. The site deliberately has one light theme. Forced-colors mode uses system `Highlight`, `ButtonText`, and `CanvasText`.

Measured rendered pairs include primary text/page **14.34:1**, secondary text/page **5.18:1**, placeholder/contact **4.80:1**, white/primary action **7.70:1**, and input boundary/contact **3.25:1**. Measurement scope and remaining automatic contrast limitations are in `artifacts/validation.md`.

## Typography

One family: **Manrope**, followed by Arial and sans-serif. The variable Latin WOFF2 is bundled at `public/fonts/manrope-latin-variable.woff2`; `@font-face` registers normal weights 400–600 with `font-display: swap`. The interface uses 400, 500, and 600. The local font was confirmed loaded in Chromium. Root smoothing is applied once, and synthesis is disabled. The font license is retained beside the asset.

| Token | Default | Role |
| --- | --- | --- |
| `--text-small` | 13px / `.8125rem` | Navigation, buttons, tags, supporting copy |
| `--text-body` | 16px / `1rem` | Body paragraphs and every form control |
| `--text-lead` | 18px / `1.125rem` | Hero description, skill headings, dialog subheads |
| `--text-title` | 24px / `1.5rem` | Project names and prepared-message heading |
| `--text-section` | 44px / `2.75rem` | Section headings; 36px at widths ≤1088px |
| `--text-display` | 72px / `4.5rem` | Hero; responsive sizes below |

The hero is weight 500, line-height 1.14 (1.15 on mobile), tracking `-.065em`. Section headings use weight 500, line-height 1.15, tracking `-.055em`; the contact heading uses 1.22. Project names use 24px/1.3 with `-.03em`; skill headings use 18px/1.4 with `-.025em`. Body line-height is 1.65, dialog paragraphs 1.7, and inputs 1.6. Small text has natural spacing and normal casing. Brand type uses weight 600 and `-.035em`.

Headings balance and can wrap long words. Descriptions use `text-wrap: pretty`; longer copy has a 56–70ch maximum. No critical content is ellipsized. SVG mockup lettering belongs to the artwork rather than the page type scale. Six interface sizes were observed at each measured width.

## Layout

The shared `.shell` is at most 1312px including inline padding, centered with logical margins. Default inline padding is 48px. Most direction-sensitive placement uses logical properties. The DOM order is header, introduction/action, work, about/skills, contact, footer.

Spacing tokens `--space-1` through `--space-7` are **8, 16, 24, 32, 48, 64, and 96px**. Use these for new sections and groups. Local 12px/20px gaps handle compact component relationships. Broad whitespace establishes hierarchy; separators appear at the about and skill boundaries.

| Breakpoint | Implemented behavior |
| --- | --- |
| ≥78rem / 1248px | Hero display grows to 76px |
| ≤68rem / 1088px | Shell padding 32px; hero display 56px; section titles 36px; tighter grid gaps |
| ≤56rem / 896px | Hero display 46px so the headline fits its tablet column |
| ≤47rem / 752px | Shell padding 24px; hero and main grids stack; illustration follows actions; decorative art captions disappear; skills become a list; form follows contact copy; footer wraps |
| ≤24rem / 384px | Shell padding 20px; hero display 38px; action row may wrap; form fields stack; project tags move below the caption |

Desktop project and about grids have two columns; skills have three. At 390px, name/email share a row and the message field spans the form. At 320px, fields stack. Controls remain inset from viewport edges. Native anchors use a 32px scroll margin. The header stays in normal flow; no floating chrome covers the page. The dialog is at most 820px wide and `100dvh - 48px` tall, scrolls internally, and keeps its close row visible.

The export was checked at 320, 390, 768, and 1440px, including 200% text enlargement at 390px. This does not establish native browser zoom or physical-device behavior.

## Elevation & depth

The interface is deliberately flat. Project previews use tonal artwork and a low-opacity black image outline. Input boundaries and tags use borders. `.button-outline` uses an inset shadow as its boundary. Modal separation comes from the backdrop, not a border/shadow stack. The project mockup illustrations contain their own artistic shadows; those do not define interface elevation.

## Shapes

`--radius-small` is **6px** for actions and fields; `--radius-medium` is **12px** for project previews and the modal. Noninteractive skill/project tags are pill-shaped. The 40px project-arrow circle is decorative inside a much larger button. Icon buttons have a 44px square target. Project images keep their original aspect ratio and text is never clipped to fit a decorative shape.

## Components

| Component or pattern | Source | Use and behavior |
| --- | --- | --- |
| Brand, main navigation, section headings, footer | `src/App.tsx` | Native anchors, hash navigation, shared alignment edges. Mobile keeps Work/About; the main contact action stays in the hero. |
| `.button`, `.button-primary`, `.button-outline`, `.text-button` | `src/styles.css` | Primary/secondary actions, minimum 50px primary target; text actions minimum 44px high. Hover changes fill/color; keyboard focus is a 2px ring offset 5px. |
| Project preview pattern | `src/App.tsx`, data in `src/content.ts` | Image and project-name buttons open the same detail dialog. Tags describe the discipline and are not controls. |
| `ProjectDialog({ project, onClose })` | `src/components/ProjectDialog.tsx` | Native modal, initial close-control focus, Tab/Shift+Tab containment, Escape/close/backdrop dismissal, scroll lock, and return to the trigger. Its contact action transfers focus to the form. |
| `ContactForm()` | `src/components/ContactForm.tsx` | Submit-time validation; required name and 20-character project message; optional email; inline associated errors and first-error focus. Valid submission prepares text locally. Copy, explicit X handoff, editing, and text download are available. Clipboard failure offers a manual-copy/download recovery. |
| `.tag`, `.tag-list` | `src/styles.css` | Static metadata, wrapping with the content. |
| `Arrow`, `Mark`, `XIcon` | `src/components/Icons.tsx` | Local SVGs using current color. Decorative SVGs are hidden from accessibility APIs. |

The empty contact form is usable, and submission stays enabled. There is no network loading state because the form performs no request. A stable `role="status"` announces copy/download feedback. Editing preserves the fields, while a page reload clears them. Native dialog semantics make the background unavailable while it is open.

Only devices reporting hover receive hover treatments. Motion is opt-in under `prefers-reduced-motion: no-preference`: 150ms named-property transitions, a `.96` press scale, and smooth anchor scrolling. No entrance animations, loops, autoplay, or motion dependencies exist. Reduced motion gets immediate state changes.

## Do’s and don’ts

- Start new content with `.shell`, the existing semantic tokens, and the six type roles. Keep primary actions visually distinct.
- Add real project entries through `src/content.ts`, including truthful scope, useful alt text, and locally bundled artwork. Keep concept labels until real work is supplied.
- Preserve the explicit contact handoff. Only say a message was sent after an actual delivery service confirms it; no such service is part of this static site.
- Keep one dominant action per section. Reuse the existing outlined/text variants for peers.
- Retain native semantics, focus behavior, form labels, and motion preferences when extending a component.
- Keep runtime assets local and URLs relative in the export. New sections should use hash anchors unless separately exported static routes are intentionally added.
- Do not introduce extra type sizes, ornamental surface layers, invented client metrics, or wallet infrastructure to decorate this portfolio.

To add another section, place it in `App.tsx` in reading order, reuse a section heading and `.shell`, use tokens from `styles.css`, and check its wrap and actions at 320/390/768/1440px. See the consolidated review in `artifacts/validation.md` and license notices in `artifacts/licenses/`.
