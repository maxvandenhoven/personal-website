# Architecture

## Overview

A static personal website with three pages: homepage, blog, and projects. Content is managed through a file-based CMS — Markdown files with frontmatter and two YAML config files under `content/`. The site is built with Astro (static generation), with React components rendered to static HTML at build time, styled with Tailwind CSS, and deployed to GitHub Pages via GitHub Actions.

The visual design follows the reference mockups in `docs/reference/`: one calm, centered column on paper-coloured ground, with generative illustrations inside framed figures. The illustrations are animated canvases printed as three-ink risographs (halftone screens, ink grain, slight misregistration between layers).

## Folder Structure

```
personal-website/
├── .claude/
│   └── ARCHITECTURE.md
├── .github/workflows/deploy.yml  # Build + deploy on push to main, manual trigger
├── .storybook/                   # Storybook config; preview runs the client controllers
├── content/                      # CMS content (not in src/ — treated as data)
│   ├── site.yaml                 # Site-wide settings: name, socials, contact, listing page copy
│   ├── homepage.yaml             # Homepage sections
│   ├── headshot.png              # Hero portrait (optimized to WebP at build time)
│   ├── blogs/[slug]/
│   │   ├── index.md              # Frontmatter, plus the article as Markdown if hosted here
│   │   ├── artwork.ts            # The post's animated illustration
│   │   ├── banner.jpg            # Optional; og:image for a hosted article
│   │   └── images/               # Optional inline images (relative paths)
│   └── projects/[slug]/
│       ├── index.md              # Frontmatter only
│       └── artwork.ts            # The project's animated illustration
├── docs/
│   └── reference/                # Static HTML design reference (kept exactly as designed)
├── public/                       # Static assets served as-is (favicon, CNAME)
├── src/
│   ├── content.config.ts         # Content collections and their schemas
│   ├── components/               # React components, rendered statically by Astro
│   │   ├── ui/                   # Primitives: Card, Chip, Pill, Tag, RisoFigure, ...
│   │   ├── layout/               # Header, NavMenu, Footer, Section, SectionHeading, PageHeading
│   │   ├── home/                 # Hero, AboutStory, StudyPath, SkillGrid
│   │   ├── blog/                 # BlogCard
│   │   ├── projects/             # ProjectCard
│   │   ├── riso/                 # MotionToggle
│   │   └── fixtures.ts           # Sample data for stories
│   ├── layouts/BaseLayout.astro  # <head>, header, footer, client script
│   ├── lib/
│   │   ├── content.ts            # Build-time content queries and card view models
│   │   ├── navigation.ts         # Nav links and numbered section labels ("02 / Projects")
│   │   ├── format.ts, tags.ts, social.ts, cx.ts
│   │   └── riso/                 # Risograph renderer (see below)
│   ├── scripts/                  # Client controllers bound to server-rendered markup
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── projects.astro        # Project listing with topic filter
│   │   ├── blog/index.astro      # Article listing with topic filter
│   │   ├── blog/[slug].astro     # Local article pages
│   │   ├── 404.astro
│   │   └── rss.xml.ts
│   └── styles/global.css         # Tailwind v4 @theme tokens, base styles, prose
└── ...config files (astro, eslint, prettier, tsconfig, Makefile)
```

## Pages

### Homepage (`/`)

Rendered from `content/site.yaml` and `content/homepage.yaml`:

1. **Hero**: title, description, social buttons, portrait
2. **01 / About**: lede and paragraphs (inline `[links](...)` supported), education timeline, skill categories (each with an animated glyph)
3. **02 / Projects**: featured project cards, in the order listed in `featured_projects.slugs`
4. **03 / Blog**: featured article cards, in the order listed in `featured_blogs.slugs`
5. **04 / Contact**: the site-wide footer

Unknown or unpublished featured slugs fail the build.

### Projects (`/projects`) and Blog (`/blog`)

Page heading plus a card grid with single-select topic filters built from the items' tags. Projects are sorted by `order`; articles by `publish_date`, newest first.

### Article (`/blog/[slug]`)

Generated for posts hosted on this site (no `external` link). Same heading style and spacing as the rest of the site, with everything (heading, artwork, rendered Markdown) in one centred 680px reading column. The interactive dot-grid background is turned off on these pages so the text stays legible; the artwork still animates.

The prose styles in `global.css` cover headings (with anchor offsets for the sticky header), lists and task lists, block quotes, images (natural size up to the column width), inline code and `kbd`, code blocks (Shiki's `css-variables` theme mapped to the design tokens, labelled with their language, scrolling sideways), tables and footnotes. `content/blogs/hello-world` is a draft that uses all of them.

### 404

Page heading with a link back to the homepage.

## Content Schema

Schemas live in `src/content.config.ts`. Entries with `draft: true` show up while running `make dev` but are left out of the build, RSS and sitemap.

### Blog (`content/blogs/[slug]/index.md`)

```yaml
title: string
description: string # Card text and meta description
reading_time: string # e.g. "17 min read"
tags: string[] # Topics, used for filtering, e.g. ["AI agents", "Security"]
publish_date: YYYY-MM-DD
external: # Optional: the article lives on another site
  url: https://...
  name: Xebia # Card call to action becomes "Read on Xebia"
artwork_alt: string # Screen reader description of artwork.ts
draft: boolean # Optional, default false
```

A post is either hosted here (no `external`, the article is the Markdown body) or links elsewhere (`external` set, no body); the build fails on anything in between.

### Project (`content/projects/[slug]/index.md`)

```yaml
title: string
monospace_title: boolean # Optional; set repository-style names in the mono font
description: string
github_link: https://...
tags: string[]
status: string # Shown on the card, e.g. "Open source", "In development"
order: number # Position on the projects page, lower first
artwork_alt: string
draft: boolean # Optional, default false
```

### Artworks (`content/<collection>/<slug>/artwork.ts`)

Every visible blog post and project needs an `artwork.ts` next to its `index.md` (the build fails otherwise). It default-exports `defineArtwork({ create, startTime? })` from `@/lib/riso/artwork`, where `create` returns a motif: a function that draws one frame through the riso `Painter`. Artworks can be shared by re-exporting another entry's (`export { default } from "../../projects/hive/artwork";`).

### Site config (`content/site.yaml`) and homepage (`content/homepage.yaml`)

Both use Astro's `file()` loader, which requires an array with `id` fields; the single entry uses `id: config`. See the files themselves for the full, commented structure.

## Client-side Behaviour

There are no hydrated React islands. Components render to static HTML, and one bundled script (`src/scripts/main.ts`, loaded by `BaseLayout`) attaches behaviour to that markup through `data-*` attributes:

- `tag-filter.ts`: topic filters on listing pages (`[data-tag-filter]`, cards expose `data-tags`)
- `motion-toggle.ts`: play/pause button in the header
- `nav-menu.ts`: the menu button that replaces the inline navigation below 900px
- `lib/riso/engine.ts`: animates every `canvas[data-figure]`, loading each artwork on demand
- `lib/riso/background.ts`: the page's dot grid that warms up near the pointer

Each controller returns a cleanup function; Storybook's preview uses them to make stories interactive.

### Risograph renderer (`src/lib/riso/`)

- `artwork.ts`: the `Artwork` type and `defineArtwork` helper used by the content artworks
- `registry.ts`: finds `content/*/*/artwork.ts` with `import.meta.glob` and maps figure IDs (`"projects/hive"`) to lazily loaded artworks, so each page only downloads the artworks it shows
- `catalog.ts`: the homepage skill glyph names, shared with the content schema (DOM-free)
- `motifs/`: the glyphs, the shared eclipse marker and the `Motif` type
- `painter.ts`: splits shapes into three halftone ink layers, then composites them with grain and misregistration, using the fixed `PRINT_SETTINGS`
- `motion.ts`: the shared paused state (starts paused for visitors who prefer reduced motion)
- `palette.ts`: reads the ink colours from the CSS design tokens

Figures redraw at 20 fps, only while on screen, and start paused when the visitor prefers reduced motion. Rendering cost grows with a figure's area, so keep figures at card size or the text column width.

## SEO

- **Open Graph tags** in `BaseLayout`; article pages use `banner.*` as `og:image` when present.
- **Canonical URLs**: per page.
- **Sitemap**: generated by `@astrojs/sitemap`.
- **RSS feed**: `/rss.xml`, all published posts; external ones link to their original site.
- **Site URL**: `https://maxvandenhoven.com` (configured in `astro.config.ts`).

## Deployment

### GitHub Actions (`deploy.yml`)

- **Triggers**: Push to `main` + `workflow_dispatch` (manual); changes only under `docs/`, `.claude/` or `.vscode/` are skipped
- **Steps**: Install Node 24, `npm ci`, `make ci`, `npm run build`, deploy to GitHub Pages

### DNS Setup

- `maxvandenhoven.com` → GitHub Pages (A records + CNAME file in repo)
- Subdomains (e.g., `postgres.maxvandenhoven.com`) → Homelab IPs (independent A records)

## Design System

- **Design tokens** in the `@theme` block of `src/styles/global.css`: colours (paper, ink, muted, rule, card, chip, accent, footer, brand), fonts, a named type scale, line heights, letter spacing, radii, shadows, breakpoints (560 / 900 / 1100px) and semantic spacing (`frame`, `inset`, `gutter`, `col-gap`, `section`) that widens at larger breakpoints.
- **Riso inks** (`--color-riso-*`, `--color-art`) live in a `@theme static` block so they are always emitted for the canvas renderer to read.
- **Fonts**: Schibsted Grotesk (text) and Martian Mono (labels, code) from Google Fonts.
- **Code highlighting**: `--color-code-*` tokens plus ink, muted and accent, applied through Shiki's `--astro-code-*` variables.
- **Light mode only**; all colours go through tokens, so a dark theme only needs new token values.
- **No external UI libraries**.

## Future Considerations

- **Dark mode toggle**: alternative token values plus a toggle in the header
- **Auto-featured content**: GitHub Action to update the featured slugs with the most recent items
- **Analytics**: Self-hosted Umami on homelab (e.g., `analytics.maxvandenhoven.com`)
- **Tag pages**: Static pages at `/blog/tag/[tag]` for SEO
