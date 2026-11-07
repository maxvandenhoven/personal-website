# Personal Website

Static personal website built with Astro, React, TypeScript, and Tailwind CSS. Deployed to GitHub Pages at `maxvandenhoven.com`.

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

- Never use raw hex/rgb colors — always use Tailwind theme tokens defined in `src/styles/global.css`
- Design tokens (colors, type scale, spacing, radii, shadows, breakpoints) live in the `@theme` block in `src/styles/global.css` (Tailwind v4 CSS-based config). Use the named scales (`text-md`, `leading-copy`, `tracking-eyebrow`, `gap-gutter`, `p-inset`, ...) rather than arbitrary values
- Token names must not collide across namespaces: Tailwind resolves `max-w-*` against `--spacing-*` before `--container-*`
- The riso ink colors are read at runtime by the canvas renderer, so they live in a `@theme static` block
- Light mode only for now; every color goes through a token so dark mode only needs new values
- Fonts: Schibsted Grotesk (`font-sans`) and Martian Mono (`font-mono`) from Google Fonts
- The visual reference is `docs/reference/` (static HTML mockups). Keep those files as they are; `docs/reference/README.md` explains how to view them

### Components

- Components live in `src/components/` organized by function:
  - `ui/` — primitives (Card, CardGrid, Chip, Pill, Tag, RisoFigure, FilterableList, ...)
  - `layout/` — structural (Header, Footer, Section, SectionHeading, PageHeading)
  - `home/` — homepage sections (Hero, AboutStory, StudyPath, SkillGrid)
  - `blog/` and `projects/` — BlogCard and ProjectCard
  - `riso/` — MotionToggle and PrintSettings
- Components are React `.tsx` files rendered to static HTML by Astro (no `client:*` hydration). Interactivity lives in `src/scripts/` controllers that bind to `data-*` attributes, loaded once by `BaseLayout`
- Pages get their data through `src/lib/content.ts`, not by querying collections directly
- One component per `.tsx` file, PascalCase naming
- Each subfolder has an `index.ts` barrel export
- Custom component library — no external UI libraries

### Storybook

- Every React component gets a co-located `.stories.tsx` file (e.g. `Tag.stories.tsx` next to `Tag.tsx`); shared sample data lives in `src/components/fixtures.ts`
- Add `tags: ["autodocs"]` in the story meta to auto-generate a docs page from the TypeScript interface
- Storybook imports `global.css` (with the Tailwind Vite plugin) and runs the client controllers, so figures animate and controls work in stories
- Stories must not import modules that use `astro:*` virtual modules (e.g. `src/lib/content.ts` at runtime); type-only imports are fine
- Astro components (`.astro`) are server-only and cannot be used in Storybook — only React `.tsx` components

### Content Authoring

Site and homepage text live in YAML; blog posts and projects are folders under `content/`. Field reference: see ARCHITECTURE.md.

**Adding a blog post:**

1. Create `content/blogs/[slug]/index.md` with the required frontmatter, including a `figure` (one of the riso illustrations) and `figure_alt`
2. Either write the article as the Markdown body (it gets a page at `/blog/[slug]`), or set `external` to link to where it was published, or both
3. Optionally add `banner.jpg` (used as the `og:image`) and an `images/` folder for inline images (`![alt](./images/photo.png)`)
4. Set `status: published` when ready (drafts are excluded from the build)

**Adding a project:**

1. Create `content/projects/[slug]/index.md` with the required frontmatter, including `figure`, `figure_alt`, `stage` and `order`
2. Set `status: published` when ready

**Site and homepage config:**

- `content/site.yaml` — name, meta description, email, social links, contact block, and the projects/blog page intros
- `content/homepage.yaml` — hero, about text (inline `[links](https://...)` supported), education, skills, and the featured project and blog slugs
- See `.claude/PROMPTS.md` for implementation prompts to use in future sessions

### Adding an illustration

1. Write a motif in `src/lib/riso/motifs/` (a function drawing one frame through the `Painter`)
2. Add its ID to `ILLUSTRATIONS` or `GLYPHS` in `src/lib/riso/catalog.ts` and register it in `src/lib/riso/figures.ts`
3. It can then be used as `figure:` in content and appears in the `UI/RisoFigure` story
