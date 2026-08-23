# Personal Website

Static personal website built with Astro, React, TypeScript, and Tailwind CSS. Deployed to GitHub Pages at `maxvandenhoven.com`.

The site uses a **notebook design**: every page is a sheet of notebook paper (ruled / square grid / isometric / plain) with a baseline grid, torn edges between homepage sections, a ruler header, sticky notes, and taped cards. `src/styles/notebook.css` is the central design config and `.claude/ARCHITECTURE.md` documents the system — read it before visual work. `notebook.html` (repo root) is the original design mock. The 404 page is the only remaining legacy (neobrutalist) page.

## Commands

All commands are available via the Makefile:

- `make dev` — start local dev server
- `make build` — build static site
- `make preview` — preview built site locally
- `make clean` — remove `dist/` and `.astro/`
- `make lint` — run ESLint (report only)
- `make format` — run Prettier (auto-fix)
- `make type` — run TypeScript type checking via `astro check`
- `make check` — auto-fix lint + format, then run typecheck
- `make ci` — run lint + format check + typecheck (all report-only, all must pass; used in CI)
- `make storybook` — start Storybook dev server on port 6006
- `make storybook-build` — build static Storybook (output: `storybook-static/`)

Additional npm scripts (used by Makefile and lint-staged):

- `npm run lint:fix` — ESLint with auto-fix
- `npm run format:check` — Prettier report only (no writes)

## Tech Stack

- **Framework**: Astro 7 with React islands for interactive components
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (light mode only, designed for easy dark mode extension)
- **Syntax Highlighting**: Shiki (VS Code-grade tokenization)
- **Package Manager**: npm
- **Node Version**: 24 (managed via nvm, see `.nvmrc`)
- **Linting**: ESLint 10 (flat config in `eslint.config.js`) with Astro, React Hooks, and TypeScript plugins
- **Formatting**: Prettier (with `prettier-plugin-astro` and `prettier-plugin-tailwindcss` for class sorting)
- **Pre-commit**: husky + lint-staged runs `eslint --fix` and `prettier --write` on staged `.ts`, `.tsx`, `.astro`, `.css` files

## Code Conventions

### Git

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Pre-commit hook runs lint-staged (auto-fixes lint + format on staged files)

### TypeScript

- Strict mode enabled, no `any` types
- Prefer interfaces over type aliases for object shapes
- Use `.tsx` for React components, `.ts` for utilities

### Styling

- Never use raw hex/rgb/px magic values in components — every color, font, and spacing value is a documented `--nb-` CSS variable in `src/styles/notebook.css` (THE central design config); new knobs get new documented tokens there
- Vertical rhythm is a baseline grid: `--nb-rule` (36px desktop / 30px mobile) — paddings, heading line-heights, and gaps must stay whole multiples of it so text sits on the paper's rules (see ARCHITECTURE.md)
- Verify visual changes with browser screenshots at desktop AND mobile widths; baseline alignment is measured in the browser, not eyeballed
- The legacy `@theme` tokens in `src/styles/global.css` exist only for the un-migrated 404 page — don't use them in new work
- Fonts (Google Fonts, loaded in `BaseLayout.astro`): Fraunces (headings), Newsreader (body), Spline Sans Mono (nav/meta/pills), Caveat (signature)
- Light mode only for now

### Components

- Components live in `src/components/` organized by function:
  - `layout/` — structural Astro components (PaperSheet, Header, SectionHeader); server-only
  - `ui/` — React visual primitives (NotebookButton, Polaroid, StickyNote, Pill)
  - `blog/` — blog-specific React (TapedBlogCard, BlogList — the only client island)
- React components are statically rendered by Astro (no `client:*` directive unless interactivity is needed)
- One component per `.tsx` file, PascalCase naming; thorough usage comments at the top
- Each subfolder has an `index.ts` barrel export
- Component props override theme defaults per-instance by setting the same `--nb-` variable inline
- Custom component library — no external UI libraries

### Storybook

- Every React component gets a co-located `.stories.tsx` file (e.g. `Pill.stories.tsx` next to `Pill.tsx`)
- Add `tags: ["autodocs"]` in the story meta to auto-generate a docs page from the TypeScript interface
- Storybook imports `global.css` so components render with the real Tailwind theme
- Astro components (`.astro`) are server-only and cannot be used in Storybook — only React `.tsx` components

### Content Authoring

Blog posts and projects are managed as folders under `content/`.

**Adding a blog post:**

1. Create `content/blogs/[slug]/`
2. Add `index.md` with required frontmatter (see ARCHITECTURE.md for fields)
3. Add `banner.png`/`banner.jpg` for the listing card and post header (rendered at 16:9; sources are 1672×941)
4. Optionally add `images/` folder for inline images (reference with relative paths: `![alt](./images/photo.png)`)
5. Set `status: published` when ready (drafts are excluded from the build)
6. Add the slug to `featured_blogs` in `content/homepage.yaml` to feature it on the homepage

**Adding a project:**

1. Create `content/projects/[slug]/`
2. Add `index.md` with required frontmatter (see ARCHITECTURE.md for fields)
3. Set `status: published` when ready
4. Note: projects are not rendered anywhere yet — the projects section is intentionally empty pending a design (see `.claude/PROMPTS.md`)

**Homepage config:**

- Edit `content/homepage.yaml` to update homepage text, social links, skills, and featured items
- See `.claude/PROMPTS.md` for implementation prompts to use in future sessions
