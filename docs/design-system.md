# Design system

The site's visual language is defined once, as design tokens in `src/styles/global.css`, and every component reads from those tokens. This page lists what the tokens are and the rules for using them. Read it before adding styles or a new component.

## Principles

The page itself stays calm. It uses paper-colored ground, near-black ink, muted gray text and a single warm accent. All the color and motion lives inside framed figures, where the artworks are printed as three-ink risographs. The result is a design where new content needs no new styling, because everything comes from the same small set of tokens.

The site is light mode only. Every color goes through a token, so a dark theme would need alternative token values and a toggle, not changes to components.

## Rules

- Never write raw hex, `rgb()` or `hsl()` colors in components or pages. Use Tailwind classes that resolve to a token, such as `bg-card`, `text-muted` or `border-rule`. New colors are added to the `@theme` block first.
- Use the named scales instead of arbitrary values. Prefer `text-md`, `leading-copy`, `tracking-eyebrow`, `gap-gutter` and `p-inset` over `text-[15px]`, `leading-[1.6]` and similar.
- Keep token names unique across namespaces. Tailwind resolves `max-w-*` against `--spacing-*` before `--container-*`, so a spacing token named like a container would shadow it.
- Keep the riso inks in `@theme static`. The canvas renderer reads them at runtime, so no class name references them and Tailwind would otherwise leave them out.
- Do not add an external UI library. The components in `src/components/` are the library.

## Tokens

All tokens live in the `@theme` block of `src/styles/global.css`. The block resets Tailwind's defaults for colors, breakpoints, type sizes, line heights, tracking, radii and shadows, so only the names below exist.

### Colors

| Token group                 | Examples                                                     | Use                                                            |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| Surfaces and text           | `paper`, `card`, `chip`, `hover`, `ink`, `muted`, `rule`     | Page ground, cards, chips, body text and hairlines             |
| Accent                      | `accent`                                                     | Focus rings, links and emphasis                                |
| Footer                      | `foot`, `foot-text`, `foot-muted`, `foot-accent` and related | The dark band at the bottom of every page                      |
| Code                        | `code-string`, `code-function`, `code-constant`              | Syntax highlighting, together with `ink`, `muted` and `accent` |
| Riso inks (`@theme static`) | `art`, `riso-warm`, `riso-dark`, `riso-light`                | Paper and the three drums read by the canvas renderer          |

### Typography

Two fonts load from Google Fonts in `BaseLayout.astro`. Schibsted Grotesk is `font-sans` and is used for text. Martian Mono is `font-mono` and is used for labels and code. The type scale runs from `text-2xs` (11 px) to `text-7xl` (44 px), with a fluid `text-display` for the largest headings. Line heights (`leading-display` to `leading-prose`) and letter spacing (`tracking-heading` to `tracking-eyebrow`) are named scales too, as are two weights (`font-weight-title` and `font-weight-heading`).

### Spacing, radii and shadows

Tailwind's default 4 px spacing scale stays in place. On top of it, semantic spacing tokens describe layout intent and widen at larger breakpoints in the base layer.

| Token     | Mobile | Meaning                                                           |
| --------- | ------ | ----------------------------------------------------------------- |
| `frame`   | 12 px  | Inner frame around figures                                        |
| `inset`   | 20 px  | Text inset inside a card (24 px from `sm`)                        |
| `gutter`  | 16 px  | Gap between sibling cards (24 px from `sm`)                       |
| `col-gap` | 48 px  | Gap between major two-column blocks (64 px from `md`)             |
| `section` | 64 px  | Gap between homepage sections (96 px from `sm`, 128 px from `md`) |

Radii are `chip`, `control`, `art` and `card`. Shadows are `lift`, `float` and `sheet`. The layout containers are `site` (1180 px), `article` (680 px) and three `measure` widths for text blocks.

### Breakpoints

| Name | Width   | Typical change                                                  |
| ---- | ------- | --------------------------------------------------------------- |
| `sm` | 560 px  | Wider insets and gutters                                        |
| `md` | 900 px  | Two-column blocks, inline navigation instead of the menu button |
| `lg` | 1100 px | Three-column card grids, when `CardGrid` is given `columns={3}` |

## Article prose

The `.prose` class in `global.css` styles rendered Markdown. It covers headings with anchor offsets for the sticky header, lists and task lists, block quotes, images, inline code and `kbd`, tables, footnotes and code blocks. Shiki runs with its `css-variables` theme, configured in `astro.config.ts`, and the `--astro-code-*` variables in `.prose` map each syntax token to a design token. The Markdown that authors can use is listed in [`guides/writing-content.md`](guides/writing-content.md).

## Accessibility

- Focus is always visible, with a 2 px accent outline.
- A `prefers-reduced-motion` media query switches off CSS transitions and animations, and the canvas animations start paused for those visitors. The header has a button to play or pause them.
- Every artwork on a card or article has a screen reader description in its `artwork_alt` field. Skill glyphs are decorative and are hidden from assistive technology.
