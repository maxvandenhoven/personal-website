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
- Design tokens (colors, spacing, fonts, radii, shadows) live in the `@theme` block in `src/styles/global.css` (Tailwind v4 CSS-based config)
- Light mode only for now; dark mode placeholder values are commented out in `global.css`
- System font stacks as defaults until a CDN font is chosen

### Components

- Components live in `src/components/` organized by function:
  - `ui/` — primitives (Button, Card, Modal, Tag, SearchBar)
  - `layout/` — structural (Header, Footer, Container, Section)
  - `blog/` — blog-specific (BlogCard, BlogList, TagFilter)
  - `projects/` — project-specific (HexGrid, HexButton, ProjectModal)
- One component per `.tsx` file, PascalCase naming
- Each subfolder has an `index.ts` barrel export
- Custom component library — no external UI libraries

### Content Authoring

Blog posts and projects are managed as folders under `content/`.

**Adding a blog post:**

1. Create `content/blogs/[slug]/`
2. Add `index.md` with required frontmatter (see ARCHITECTURE.md for fields)
3. Add `banner.png` for the listing card and post header
4. Optionally add `images/` folder for inline images (reference with relative paths: `![alt](./images/photo.png)`)
5. Set `status: published` when ready (drafts are excluded from the build)

**Adding a project:**

1. Create `content/projects/[slug]/`
2. Add `index.md` with required frontmatter (see ARCHITECTURE.md for fields)
3. Add `logo.svg` for the hex grid button
4. Set `status: published` when ready

**Homepage config:**

- Edit `content/homepage.yaml` to update homepage text, social links, skills, and featured items
- See `.claude/PROMPTS.md` for implementation prompts to use in future sessions
