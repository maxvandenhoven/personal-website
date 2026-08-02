# Personal Website

Static personal website built with Astro, React, TypeScript, and Tailwind CSS. Deployed to GitHub Pages at `maxvandenhoven.com`.

## Commands

All commands are available via the Makefile:

- `make dev` — start local dev server
- `make build` — build static site
- `make preview` — preview built site locally
- `make clean` — remove build artifacts
- `make lint` — run ESLint + TypeScript type checking
- `make format` — run Prettier (auto-fix)
- `make check` — run lint + format check + type check (same as pre-commit hook)

## Tech Stack

- **Framework**: Astro with React islands for interactive components
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (light mode only, designed for easy dark mode extension)
- **Syntax Highlighting**: Shiki (VS Code-grade tokenization)
- **Package Manager**: npm
- **Node Version**: 24 LTS (see `.nvmrc`)
- **Linting**: ESLint (with Astro + React + TypeScript plugins)
- **Formatting**: Prettier (with Tailwind class sorting plugin)
- **Pre-commit**: husky + lint-staged runs `make check`

## Code Conventions

### Git

- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Pre-commit hook enforces lint + format + type check

### TypeScript

- Strict mode enabled, no `any` types
- Prefer interfaces over type aliases for object shapes
- Use `.tsx` for React components, `.ts` for utilities

### Styling

- Never use raw hex/rgb colors — always use Tailwind theme tokens defined in `tailwind.config.ts`
- Design tokens (colors, spacing, fonts, radii) live in `tailwind.config.ts`
- Light mode only for now; when adding dark mode, use Tailwind `dark:` variants
- Font loaded via CDN (configured in base layout)

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
