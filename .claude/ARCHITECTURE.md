# Architecture

## Overview

A static personal website with three pages: homepage, blog, and projects. Content is managed through a file-based CMS — Markdown files with frontmatter metadata, organized in folders. The site is built with Astro (static generation) and React (interactive islands), styled with Tailwind CSS, and deployed to GitHub Pages via GitHub Actions.

## Folder Structure

```
personal-website/
├── .claude/
│   └── ARCHITECTURE.md
├── .github/
│   └── workflows/
│       └── deploy.yml          # Build + deploy on push to main, manual trigger
├── .husky/
│   └── pre-commit              # Runs `make check`
├── content/                    # CMS content (not in src/ — treated as data)
│   ├── homepage.yaml             # Homepage configuration
│   ├── blogs/
│   │   └── [slug]/
│   │       ├── index.md        # Blog content + frontmatter
│   │       ├── banner.png      # Listing card and post header image
│   │       └── images/         # Optional inline images (relative paths)
│   └── projects/
│       └── [slug]/
│           ├── index.md        # Project content + frontmatter
│           └── logo.svg        # Hex grid button icon
├── public/                     # Static assets served as-is (favicon, robots.txt)
├── src/
│   ├── components/
│   │   ├── ui/                 # Primitives: Button, Card, Modal, Tag, SearchBar
│   │   ├── layout/             # Structural: Header, Footer, Container, Section
│   │   ├── blog/               # BlogCard, BlogList, TagFilter
│   │   └── projects/           # HexGrid, HexButton, ProjectModal
│   ├── layouts/                # Astro layouts (BaseLayout with <head>, OG tags)
│   ├── pages/                  # Astro file-based routing
│   │   ├── index.astro         # Homepage
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog listing (search, filter, sort)
│   │   │   └── [slug].astro    # Individual blog post
│   │   ├── projects.astro      # Projects hex grid
│   │   ├── 404.astro           # Custom 404 page
│   │   └── rss.xml.ts          # RSS feed endpoint
│   └── styles/                 # Global CSS, Tailwind base/utilities
├── astro.config.ts
├── tailwind.config.ts          # Design tokens: colors, fonts, spacing, radii
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
├── .nvmrc                      # Node 24
├── .editorconfig
├── Makefile
├── CLAUDE.md
└── package.json
```

## Pages

### Homepage (`/`)

Renders content from `content/homepage.yaml`. Sections in order:

1. **Hero**: `name`, `job_title`, `hero_tagline`, `hero_description`
2. **Social links**: `github_link`, `linkedin_link`, `twitter_link`, `email_link`
3. **Skills**: `skills_description` + array of `{ skill_title, entries: string[] }`
4. **Featured projects**: Cards for slugs listed in `featured_projects`
5. **Featured blogs**: Cards for slugs listed in `featured_blogs`

Static Astro page — no client-side JS needed.

### Blog Listing (`/blog`)

Displays all published blog posts. Interactive React island with:

- **Search bar**: Filters posts by title and description (client-side)
- **Tag filter**: Click tags to filter (client-side)
- **Date sorting**: Chronological ordering

Each post shows as a card with banner, title, description, tags, reading time, and publish date.

### Blog Post (`/blog/[slug]`)

Renders the full `index.md` content with:

- Banner image at the top
- Title, publish date, reading time, tags from frontmatter
- Markdown body with Shiki syntax highlighting
- OG meta tags using the banner as `og:image`

### Projects (`/projects`)

Interactive React island: hexagonal grid of buttons. Each hexagon:

- Displays the project's `logo.svg`
- Uses `background_color` and `foreground_color` from frontmatter
- On click: opens a modal/hover overlay showing:
  - Rendered `index.md` content
  - Link to GitHub (`github_link`)
  - Links to relevant blog posts (`relevant_blogs` slugs)

Projects do not have individual pages — detailed write-ups live as blog posts.

### 404

Custom error page with site header/footer and a link back to the homepage.

## Content Schema

### Blog Frontmatter (`content/blogs/[slug]/index.md`)

```yaml
---
title: string           # Post title
description: string     # Short summary for listing cards and OG tags
reading_time: string    # e.g., "5 min read"
tags: string[]          # e.g., ["rust", "webdev"]
status: "draft" | "published"
publish_date: string    # ISO date, e.g., "2026-08-01"
---
```

### Project Frontmatter (`content/projects/[slug]/index.md`)

```yaml
---
title: string           # Project name
description: string     # Short summary for modal and OG tags
github_link: string     # URL to GitHub repo
technologies: string[]  # e.g., ["Python", "FastAPI", "PostgreSQL"]
background_color: string # Hex color for hex grid button background
foreground_color: string # Hex color for hex grid button foreground/text
relevant_blogs: string[] # Slugs of related blog posts
status: "draft" | "published"
---
```

### Homepage Config (`content/homepage.yaml`)

```yaml
name: string
job_title: string
hero_tagline: string
hero_description: string
github_link: string
linkedin_link: string
twitter_link: string
email_link: string
skills_description: string
skills:
  - skill_title: string
    entries: [string]
featured_projects: [string] # Project slugs
featured_blogs: [string] # Blog slugs
```

## Interactive Components (React Islands)

Only two pages require client-side interactivity — Astro renders everything else as static HTML:

1. **Blog listing** (`/blog`): Search, tag filtering, date sorting over the full post list. All post metadata is passed as props at build time.
2. **Projects hex grid** (`/projects`): Hexagonal button layout + modal rendering. All project data is passed as props at build time.

Both components receive their data as serialized props from Astro — no client-side data fetching.

## SEO

- **Open Graph tags**: Set per-page in a shared `<head>` component within `BaseLayout`. Blog posts use `banner.png` as `og:image`, projects use `logo.svg`.
- **Sitemap**: Auto-generated by `@astrojs/sitemap` plugin.
- **RSS feed**: Generated at `/rss.xml` by `@astrojs/rss` for all published blog posts.
- **Site URL**: `https://maxvandenhoven.com` (configured in `astro.config.ts`)

## Deployment

### GitHub Actions (`deploy.yml`)

- **Triggers**: Push to `main` + `workflow_dispatch` (manual)
- **Steps**: Install Node 24, `npm ci`, `npm run build`, deploy to GitHub Pages
- **Linting in CI**: Runs `make check` before build to catch issues

### DNS Setup

- `maxvandenhoven.com` → GitHub Pages (A records + CNAME file in repo)
- Subdomains (e.g., `postgres.maxvandenhoven.com`) → Homelab IPs (independent A records)

## Design System

- **Design tokens** defined in `tailwind.config.ts`: colors, fonts, spacing, border radii, shadows
- **Light mode only** for now; architecture supports dark mode via Tailwind `dark:` variants
- **Font**: Loaded via CDN (choice deferred — configured in base layout, referenced in Tailwind config)
- **No external UI libraries** — custom component library for consistency
- **Syntax highlighting**: Shiki with VS Code-grade tokenization (theme choice deferred)

## Future Considerations

These are not built now but the architecture accommodates them:

- **Dark mode toggle**: Add `dark:` variant classes to components, wire up a theme toggle in the header
- **Auto-featured content**: GitHub Action to update `featured_projects`/`featured_blogs` in `homepage.yaml` with the 3 most recent published items
- **Analytics**: Self-hosted Umami on homelab (e.g., `analytics.maxvandenhoven.com`)
- **Tag pages**: Static pages at `/blog/tag/[tag]` for SEO
