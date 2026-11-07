# Architecture

## Overview

A static personal website with three pages: homepage, blog, and projects. Content is managed through a file-based CMS — Markdown files with frontmatter and two YAML config files under `content/`. The site is built with Astro (static generation), with React components rendered to static HTML at build time, styled with Tailwind CSS, and deployed to GitHub Pages via GitHub Actions.

The visual design follows the reference mockups in `docs/reference/`: one calm, centered column on paper-coloured ground, with generative illustrations inside framed figures. The illustrations are animated canvases printed as three-ink risographs (halftone screens, ink grain, slight misregistration between layers), tunable through a "Print settings" panel.

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
│   │   ├── index.md              # Frontmatter + optional Markdown body
│   │   ├── banner.jpg            # Optional; used as og:image for the post page
│   │   └── images/               # Optional inline images (relative paths)
│   └── projects/[slug]/index.md  # Frontmatter only
├── docs/
│   └── reference/                # Static HTML design reference (kept exactly as designed)
├── public/                       # Static assets served as-is (favicon, CNAME)
├── src/
│   ├── content.config.ts         # Content collections and their schemas
│   ├── components/               # React components, rendered statically by Astro
│   │   ├── ui/                   # Primitives: Card, Chip, Pill, Tag, RisoFigure, ...
│   │   ├── layout/               # Header, Footer, Section, SectionHeading, PageHeading
│   │   ├── home/                 # Hero, AboutStory, StudyPath, SkillGrid
│   │   ├── blog/                 # BlogCard
│   │   ├── projects/             # ProjectCard
│   │   ├── riso/                 # MotionToggle, PrintSettings
│   │   └── fixtures.ts           # Sample data for stories
│   ├── layouts/BaseLayout.astro  # <head>, header, footer, print settings, client script
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

Page heading plus a card grid with single-select topic filters built from the items' tags. Projects are sorted by `order`; articles by `updated_date` (or `publish_date`), newest first.

### Article (`/blog/[slug]`)

Generated only for published posts with a Markdown body. Shows the heading, metadata, the post's figure and the rendered Markdown (Shiki syntax highlighting). When the post has `external` set, its canonical URL points at the original publication.

### 404

Page heading with a link back to the homepage.

## Content Schema

Schemas live in `src/content.config.ts`; drafts (`status: draft`) are excluded everywhere.

### Blog (`content/blogs/[slug]/index.md`)

```yaml
title: string
description: string # Card text and meta description
reading_time: string # e.g. "17 min read"
tags: string[] # Topics, used for filtering, e.g. ["AI agents", "Security"]
status: draft | published
publish_date: YYYY-MM-DD
updated_date: YYYY-MM-DD # Optional; shown as "Updated <date>" and used for sorting
external: # Optional; where the article was originally published
  url: https://...
  site: Xebia # Card call to action becomes "Read on Xebia"
figure: trials | hive | imposter | site | sandboxes | forecast
figure_alt: string # Screen reader description of the animation
```

A post needs a Markdown body, an `external` link, or both. Cards link to `external.url` when set, otherwise to the local page.

### Project (`content/projects/[slug]/index.md`)

```yaml
title: string
monospace_title: boolean # Optional; set repository-style names in the mono font
description: string
github_link: https://...
tags: string[]
stage: string # e.g. "Open source", "In development"
order: number # Position on the projects page, lower first
status: draft | published
figure: (as for blogs)
figure_alt: string
```

### Site config (`content/site.yaml`) and homepage (`content/homepage.yaml`)

Both use Astro's `file()` loader, which requires an array with `id` fields; the single entry uses `id: config`. See the files themselves for the full, commented structure.

## Client-side Behaviour

There are no hydrated React islands. Components render to static HTML, and one bundled script (`src/scripts/main.ts`, loaded by `BaseLayout`) attaches behaviour to that markup through `data-*` attributes:

- `tag-filter.ts`: topic filters on listing pages (`[data-tag-filter]`, cards expose `data-tags`)
- `motion-toggle.ts`: play/pause button in the header
- `print-settings.ts`: the print settings dock
- `lib/riso/engine.ts`: animates every `canvas[data-figure]`
- `lib/riso/background.ts`: the page's dot grid that warms up near the pointer

Each controller returns a cleanup function; Storybook's preview uses them to make stories interactive.

### Risograph renderer (`src/lib/riso/`)

- `catalog.ts`: figure IDs, shared with the content schema (DOM-free)
- `figures.ts`: maps each ID to a motif and its options
- `motifs/`: one drawing function per illustration or glyph
- `painter.ts`: splits shapes into three halftone ink layers, then composites them with grain and misregistration
- `settings.ts`: observable print settings (persisted in `localStorage`) and the paused state
- `palette.ts`: reads the ink colours from the CSS design tokens

Figures redraw at 20 fps, only while on screen, and start paused when the visitor prefers reduced motion. Rendering cost grows with a figure's area, so keep figures at card size or the text column width.

## SEO

- **Open Graph tags** in `BaseLayout`; article pages use `banner.*` as `og:image` when present.
- **Canonical URLs**: per page; syndicated articles point to the original.
- **Sitemap**: generated by `@astrojs/sitemap`.
- **RSS feed**: `/rss.xml`, all published posts.
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
- **Light mode only**; all colours go through tokens, so a dark theme only needs new token values.
- **No external UI libraries**.

## Future Considerations

- **Dark mode toggle**: alternative token values plus a toggle in the header
- **Auto-featured content**: GitHub Action to update the featured slugs with the most recent items
- **Analytics**: Self-hosted Umami on homelab (e.g., `analytics.maxvandenhoven.com`)
- **Tag pages**: Static pages at `/blog/tag/[tag]` for SEO
