# Personal website

Static personal website for `maxvandenhoven.com`, built with Astro 7, React 19, TypeScript (strict) and Tailwind CSS v4, and deployed to GitHub Pages. Start with `README.md` for the background and `docs/architecture.md` for how the code fits together.

## Commands

Run everything through `make`.

- `make dev` starts the dev server. Drafts are visible here and left out of builds.
- `make build` builds into `dist/`, and `make preview` serves it.
- `make check` fixes lint, formats and type checks. Run it before you finish a change.
- `make ci` runs the same checks as GitHub without changing files. All of them must pass.
- `make lint`, `make format`, `make type` and `make clean` run single steps.

There is no automated test suite. Verify a change with `make ci`, `make build` and, for visual changes, by looking at the page at phone and desktop width.

## Where to find things

| Topic                                            | Read                                |
| ------------------------------------------------ | ----------------------------------- |
| Structure, data flow, renderer, design decisions | `docs/architecture.md`              |
| Tokens and styling rules                         | `docs/design-system.md`             |
| Setup, checks, conventions, common changes       | `docs/guides/development.md`        |
| Frontmatter, YAML config, Markdown, tags         | `docs/guides/writing-content.md`    |
| `artwork.ts`, painter API, previewing            | `docs/guides/artworks.md`           |
| Release flow and CI                              | `docs/guides/deployment.md`         |
| Pages, DNS and HTTPS setup                       | `docs/guides/setup-github-pages.md` |

## Rules

- **Content.** Skills, blog posts and projects are folders under `content/` with an `index.md` and an `artwork.ts`. Every visible entry needs an artwork, or the build fails. The homepage chooses featured entries by folder name in `content/homepage.yaml`.
- **Data access.** Pages get their data from `src/lib/content.ts` and never query collections directly.
- **Components.** Components are React `.tsx` files rendered to static HTML. Do not add `client:*` hydration, state or effects. Put interactivity in `src/scripts/` controllers that bind to `data-*` attributes and return a cleanup function.
- **Component files.** One component per file in PascalCase, exported from the folder's `index.ts` barrel. Use no external UI library.
- **Styling.** Never use raw hex or rgb colors. Use the tokens and named scales from the `@theme` block in `src/styles/global.css`. The riso inks stay in `@theme static`. The site is light mode only.
- **TypeScript.** No `any`. Prefer `interface` for object shapes. Use `.tsx` for components and `.ts` for utilities.
- **Artworks.** Figures redraw every frame, so keep them at card size or article width. To reuse another entry's artwork, re-export it.
- **Git.** Use conventional commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`). The pre-commit hook runs lint-staged. Pushes that only change `docs/` or `.claude/` do not trigger a deploy.

## Skills

- `riso-artwork` creates or revises an `artwork.ts` from a link, text or idea and previews it with `node .claude/skills/riso-artwork/scripts/preview.mjs <artwork.ts>`.
- `writing-style` applies to any website copy, blog text or README prose.

## Keeping docs current

Update the matching page in `docs/` in the same change when you alter a schema, a command, a workflow, a token or the artwork API. Write documentation for both people and agents, with exact paths, commands and field names, and follow the `writing-style` skill.
