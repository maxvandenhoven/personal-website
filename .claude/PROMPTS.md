# Implementation Prompts

Work through these prompts in order. Each one is a self-contained session. Run each prompt in a new Claude Code conversation — the CLAUDE.md and ARCHITECTURE.md files provide the context needed.

---

## Phase 1: Dev Tooling Setup

### 1.1 — Initialize the Astro project

```
Initialize this repo as an Astro project using `npm create astro@latest`. Use the current directory (not a subdirectory), TypeScript strict mode, and install dependencies. Do NOT create sample files — use the minimal/empty template. After initialization, install the React and Tailwind integrations using `npx astro add react` and `npx astro add tailwind`. Configure `astro.config.ts` with `site: "https://maxvandenhoven.com"` and add the sitemap integration with `npx astro add sitemap`. Install `@astrojs/rss` as a dependency. Set up the `.nvmrc` with Node 24. Verify `npm run dev` starts without errors.
```

### 1.2 — Configure Tailwind design tokens

```
Set up `tailwind.config.ts` with a placeholder design token structure: a color palette (primary, surface, text, accent — with light mode values and placeholder slots for dark mode), font family entries (sans and mono, using system fonts as defaults until we pick a CDN font), and consistent spacing/border-radius/shadow scales. Keep it minimal but extensible. Verify the Tailwind config is valid by running a build.
```

### 1.3 — Set up ESLint, Prettier, and TypeScript checking

```
Install and configure ESLint with the Astro parser, TypeScript, and React plugins. Install Prettier with the Tailwind class sorting plugin (`prettier-plugin-tailwindcss`) and the Astro plugin (`prettier-plugin-astro`). Create `.eslintrc.cjs` and `.prettierrc` config files. Make sure ESLint and Prettier don't conflict with each other (install `eslint-config-prettier`). Add npm scripts in package.json: `lint`, `lint:fix`, `format`, `format:check`, and `typecheck`. Verify all three tools run cleanly on the existing project files.
```

### 1.4 — Set up the Makefile and pre-commit hook

```
Create the Makefile with these targets: `dev`, `build`, `preview`, `clean`, `lint`, `format`, `check`. The `check` target should run lint + format check + typecheck (all three must pass). The `clean` target removes the `dist/` and `.astro/` directories. Install `husky` and `lint-staged`. Configure husky with a pre-commit hook that runs `make check`. Configure lint-staged to run ESLint and Prettier on staged `.ts`, `.tsx`, `.astro`, and `.css` files. Add an `.editorconfig` file. Verify `make check` passes and the pre-commit hook triggers on a test commit.
```

### 1.5 — Set up GitHub Actions deployment

```
Create `.github/workflows/deploy.yml` for GitHub Pages deployment. It should trigger on push to main and workflow_dispatch. Steps: checkout, setup Node 24, npm ci, make check, npm run build, deploy to GitHub Pages using the official `actions/deploy-pages` action. Add a CNAME file in `public/` with `maxvandenhoven.com`. Make sure the workflow uses the correct permissions for GitHub Pages deployment. Do a dry run of `make build` locally to verify the build succeeds.
```

---

## Phase 2: Content Scaffold

### 2.1 — Set up Astro content collections

```
Read ARCHITECTURE.md for the content schema. Set up Astro content collections for blogs and projects in `src/content/config.ts`. Define Zod schemas matching the blog and project frontmatter fields from ARCHITECTURE.md. The content files live in `content/blogs/` and `content/projects/` (at the repo root, not inside `src/`). Configure Astro to use this content directory. Also set up loading for `content/homepage.yaml` — use a simple YAML import or Astro's data collections for this. Verify the schemas compile without errors.
```

### 2.2 — Create test content

```
Create test content to validate the build pipeline. Add `content/homepage.yaml` with all fields populated with placeholder text (see ARCHITECTURE.md for the schema). Create two test blog posts in `content/blogs/` — `hello-world` and `second-post` — each with an `index.md` (with valid frontmatter), a placeholder `banner.png` (use a simple colored rectangle), and one with an `images/` folder containing a test image referenced in the markdown body. Create one test project in `content/projects/test-project/` with an `index.md` and a simple placeholder `logo.svg`. Make sure at least one blog and one project have `status: published` and one has `status: draft`. Set `featured_projects` and `featured_blogs` in homepage.yaml to reference the published items. Verify `make build` succeeds.
```

### 2.3 — Create barebones page templates

```
Read ARCHITECTURE.md for page structure. Create a minimal `BaseLayout.astro` in `src/layouts/` that includes the HTML skeleton, a `<head>` with OG meta tags (title, description, og:image passed as props), and a basic header/footer placeholder. Create these pages with unstyled HTML that just renders the correct data:

- `src/pages/index.astro` — loads `content/homepage.yaml` and renders all sections as plain text/lists
- `src/pages/blog/index.astro` — queries all published blog posts and renders them as a simple list of titles with links
- `src/pages/blog/[slug].astro` — renders a single blog post's content with title and metadata
- `src/pages/projects.astro` — queries all published projects and renders them as a simple list
- `src/pages/404.astro` — simple "page not found" message with a link home
- `src/pages/rss.xml.ts` — generates RSS feed for published blog posts

Verify all pages render correctly with test content by running `make dev` and visiting each route. Check that draft posts are excluded from listings and that the blog post page renders markdown correctly with syntax highlighting. Do NOT add any styling yet — just validate the data pipeline works end-to-end.
```

---

## Phase 3: Component Library & Styling

### 3.1 — Build layout components

```
Create the structural layout components in `src/components/layout/`: Header (with nav links to /, /blog, /projects), Footer (with social links), Container (max-width wrapper), and Section (consistent vertical spacing). Add an `index.ts` barrel export. Style them with Tailwind using the design tokens from `tailwind.config.ts`. Update `BaseLayout.astro` to use these components. Verify the layout looks correct on desktop and mobile by checking in the browser.
```

### 3.2 — Build UI primitives

```
Create the base UI components in `src/components/ui/`: Button (with variants: primary, secondary, ghost), Card (content container with optional image), Tag (small pill for blog tags), SearchBar (text input with search icon), and Modal (overlay dialog with close button, for projects). Add an `index.ts` barrel export. Style with Tailwind. These should be clean, reusable React components. Don't integrate them into pages yet — just make sure they render correctly in isolation by temporarily mounting them on a test page.
```

### 3.3 — Build blog components and style the blog pages

```
Create the blog-specific components in `src/components/blog/`: BlogCard (shows banner, title, description, tags, reading time, publish date), BlogList (the interactive React island with search bar, tag filter, and date sorting), and TagFilter (clickable tag pills that filter the list). Add an `index.ts` barrel export. Integrate BlogList into `src/pages/blog/index.astro` as a React island (`client:load`). Style the individual blog post page (`src/pages/blog/[slug].astro`) with proper typography, banner image, metadata display, and markdown content styling. Verify everything works in the browser — test search, tag filtering, and that draft posts are excluded.
```

### 3.4 — Build project components and style the projects page

```
Create the project-specific components in `src/components/projects/`: HexButton (hexagonal button showing logo.svg with background_color/foreground_color), HexGrid (honeycomb layout of HexButtons), and ProjectModal (overlay showing rendered project content, GitHub link, and relevant blog links). Add an `index.ts` barrel export. Integrate HexGrid into `src/pages/projects.astro` as a React island (`client:load`). The hex grid should be responsive. Verify the grid renders, buttons show the correct colors/logos, and clicking opens the modal with the right content.
```

### 3.5 — Style the homepage

```
Style the homepage (`src/pages/index.astro`) using the layout and UI components. Build out each section: hero (name, title, tagline, description), social links (as icon buttons), skills (categorized lists), featured projects (cards linking to /projects), and featured blogs (BlogCard components linking to individual posts). Make sure the page is responsive and looks good on mobile. Verify all sections render the correct data from `content/homepage.yaml`.
```

### 3.6 — Style the 404 page

```
Style the 404 page (`src/pages/404.astro`) to match the site design. Include the site header and footer, a clear "page not found" message, and a button linking back to the homepage. Keep it simple.
```

---

## Phase 4: Polish

### 4.1 — Responsive design pass

```
Review all pages on mobile, tablet, and desktop widths. Fix any layout issues — especially the hex grid on small screens, the blog listing cards, and the homepage sections. Make sure the header nav works well on mobile (consider a hamburger menu if needed). Test in the browser at 375px, 768px, and 1280px widths.
```

### 4.2 — SEO and meta tags pass

```
Verify all pages have correct OG meta tags by inspecting the built HTML. Check that blog posts use their banner as og:image, and projects use their logo. Verify the sitemap is generated at /sitemap-index.xml and includes all published pages. Verify the RSS feed at /rss.xml contains all published blog posts with correct links. Test by running `make build` and inspecting the output in `dist/`.
```

### 4.3 — Final pre-launch checklist

```
Run through this checklist and fix any issues:
- `make check` passes with zero warnings
- `make build` succeeds
- All pages render correctly in the browser
- Draft content is excluded from all listings, feeds, and sitemap
- Links between pages work (blog cards → post, project relevant_blogs → posts)
- Images load correctly (banners, logos, inline images)
- The site looks correct at mobile, tablet, and desktop widths
- OG tags are present on all pages
- RSS feed and sitemap are generated
- CNAME file is in the build output
- 404 page works
```
