# Architecture

## Overview

A static personal website with three pages: homepage, blog, and projects. Content is managed through a file-based CMS — Markdown files with frontmatter metadata, organized in folders. The site is built with Astro (static generation) and React (server-rendered components, plus one interactive island), styled with Tailwind CSS + a custom **notebook design system**, and deployed to GitHub Pages via GitHub Actions.

**Design language (2026-08 redesign):** the whole site looks like a stack of notebook pages. Each section/page is a "sheet" of paper (ruled, square-grid, isometric, or plain) with torn edges between homepage sections, a translucent ruler as the sticky header, a pinned polaroid, sticky notes, and washi-taped blog cards. The original mock is `notebook.html` in the repo root. The one legacy holdout is the 404 page (still neobrutalist).

## Folder Structure

```
personal-website/
├── .claude/
│   ├── ARCHITECTURE.md         # This file
│   └── PROMPTS.md              # Prompts for future sessions (remaining work)
├── .github/workflows/deploy.yml # Build + deploy on push to main
├── .husky/pre-commit           # lint-staged (eslint --fix + prettier --write)
├── .storybook/                 # Storybook 10 (react-vite); preview-head.html loads the fonts
├── content/                    # CMS content (not in src/ — treated as data)
│   ├── homepage.yaml           # Homepage configuration
│   ├── headshot.jpeg           # Hero polaroid photo
│   ├── blogs/[slug]/           # index.md + banner (1672x941 ≈ 16:9) + images/
│   └── projects/[slug]/        # index.md + logo.svg (not rendered anywhere yet)
├── notebook.html               # The original design mock — source of truth for the look
├── src/
│   ├── content.config.ts       # Zod schemas: blogs, projects, homepage
│   ├── components/
│   │   ├── layout/             # Astro structural components (no Storybook)
│   │   │   ├── Header.astro        # The sticky "ruler" header
│   │   │   ├── PaperSheet.astro    # THE section backbone: paper bg, tear, margin, lattice
│   │   │   └── SectionHeader.astro # Shared title + subtitle block
│   │   ├── ui/                 # React visual primitives (each with a .stories.tsx)
│   │   │   ├── NotebookButton.tsx  # CTA button
│   │   │   ├── Polaroid.tsx        # Pinned tilted photo w/ SVG push-pin + signature
│   │   │   ├── StickyNote.tsx      # Skill-group note, sized to the grid squares
│   │   │   └── Pill.tsx            # Small tag pill
│   │   └── blog/
│   │       ├── TapedBlogCard.tsx   # Card with washi tape (+ .stories.tsx)
│   │       └── BlogList.tsx        # Interactive listing island (filter/sort)
│   ├── layouts/BaseLayout.astro # <head>, OG tags, Google Fonts, Header, footer
│   ├── pages/
│   │   ├── index.astro         # Homepage: hero / skills / blog / projects sheets
│   │   ├── blog/index.astro    # Blog listing (blue ruled sheet + BlogList island)
│   │   ├── blog/[slug].astro   # Post (plain white sheet, .nb-prose)
│   │   ├── projects.astro      # Black isometric sheet, intentionally empty
│   │   ├── 404.astro           # Legacy neobrutalist (only un-migrated page)
│   │   └── rss.xml.ts          # RSS feed
│   └── styles/
│       ├── global.css          # Tailwind v4 + legacy tokens (only 404 uses them) + imports notebook.css
│       └── notebook.css        # ★ THE central notebook config + all notebook CSS
├── Makefile                    # dev/build/preview/lint/format/type/check/ci/storybook
├── CLAUDE.md
└── package.json
```

## The Notebook Design System (`src/styles/notebook.css`)

This file is **the single place to change the look**. Every color, font, spacing value, and component default is a documented CSS variable prefixed `--nb-`. Components read them via `var(--nb-…)` and accept props that override one instance by setting the same variable inline. **Never hardcode colors/px in components — add a documented `--nb-` token.**

Key mechanisms (all in `notebook.css`, heavily commented in place):

- **Baseline grid (`--nb-rule`)**: one ruled line = 36px desktop / 30px mobile (≤640px). All vertical rhythm (section padding, heading line-heights [2 rules per line], gaps, sticky-note sizing) is whole multiples of it, so text and components sit ON the paper's lines. Headings/subtitles get a _derived_ `translateY` nudge — `slot/2 − 3px − (ascent − 0.5em)·font-size` with measured ascent constants (≈0.86em Fraunces, ≈0.72em Newsreader) — so baselines rest ~3px above a rule at every breakpoint. Do not replace these with fixed em values; they must scale.
- **One shared vertical lattice**: the square grid's vertical lines (`.nb-grid-vlines`), the ruler header's major ticks, and the red/teal margin rule (one rule left of the content column) are all anchored to the content column's left edge via the same widened-layer trick (`left: calc(max(0px,(100% − max)/2) + pad)`, ±100 rules wide, clipped). Sticky notes are 8×8 rules with one-rule gaps, so they fall exactly inside the grid squares.
- **Torn edges**: each section is a `PaperSheet`; its paper (color + pattern + margin rule) lives on a dedicated absolute background layer that, when `torn`, extends `--nb-torn-overlap` below the sheet and is masked by the ragged `--nb-torn-mask` SVG — so rules run seamlessly into the rip. Earlier sheets get a higher `layer` (z-index) so their overhang stacks on top. **Swapping in a real ripped-paper PNG later = replacing `--nb-torn-mask` only.**
- **Plain sheets** (`pattern="none"`, used by blog posts): `nb-sheet--plain` switches the baseline machinery off (no nudges, natural line-heights, full-width subtitle).
- **Hero centering**: full-height sheets compute top padding as viewport-half minus `--nb-hero-center-offset`, `round()`ed to whole rules — centered on tall screens, phase-locked always.
- **Shadows**: shared `--nb-shadow-small` / `--nb-shadow-big` stacks (contact + directional ambient) — the quality bar for anything lifted off the page.
- **Rotation policy**: sticky notes and cards sit straight; only the washi tape rotates (`tapeTilt` prop, cycled per card) and the polaroid tilts +3deg clockwise.

## Pages

### Homepage (`/`)

Four stacked `PaperSheet`s (layers 4→1): **hero** (beige ruled, red margin, torn, full-height, highlighted tagline word, CTA + text link, pinned polaroid), **skills** (white square grid, torn, sticky notes in the squares), **blog** (light-blue ruled, teal margin, torn, taped cards for `featured_blogs`), **projects** (black isometric, header only). All static.

### Blog Listing (`/blog`)

One light-blue ruled sheet (same palette as the homepage blog section, `padTopRules={2}`). `SectionHeader` + the `BlogList` React island (`client:load`): tag-filter pills (AND-filtering, fill teal when active), a pill-styled sort select, "Clear" mono link — the row is exactly one rule tall and centered between rules. Cards are `TapedBlogCard`s with cycled tape tilts.

### Blog Post (`/blog/[slug]`)

Plain white sheet (`pattern="none"` — no rules behind long-form text, for legibility). Mono meta line, title + full-width description, 16:9 banner with soft shadow, body in `.nb-prose` (Newsreader body, Fraunces headings, Shiki code blocks).

### Projects (`/projects`)

The black isometric sheet with a light-tone `SectionHeader`. **Intentionally empty** — the old hex-grid concept was removed with the redesign; what replaces it is undecided. The `projects` content collection and schema still exist for when it's built.

### 404

Still neobrutalist (uses `btn-lift` + legacy tokens in `global.css`). Migrate in a later pass.

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

Banners are `banner.{png,jpg,jpeg,webp}`, rendered at 16:9 (source images are 1672×941).

### Project Frontmatter (`content/projects/[slug]/index.md`)

```yaml
---
title: string
description: string
github_link: string
technologies: string[]
background_color: string # Currently unused (was for the removed hex grid)
foreground_color: string # Currently unused
relevant_blogs: string[] # Slugs of related blog posts
status: "draft" | "published"
---
```

### Homepage Config (`content/homepage.yaml`)

Uses Astro's `file()` loader (array with `id: config`, queried via `getEntry("homepage", "config")`).

```yaml
- id: config
  name: string
  hero_tagline: string
  hero_highlight: string # Word inside hero_tagline that gets the highlighter swipe
  hero_description: string
  github_link: string
  linkedin_link: string
  twitter_link: string
  email_link: string # Social links are currently not rendered (removed with the redesign)
  skills_title: string
  skills_description: string
  blog_title: string
  blog_description: string
  projects_title: string
  projects_description: string
  skills:
    - skill_title: string
      entries: [string]
  featured_projects: [string] # Project slugs (currently unused — projects section empty)
  featured_blogs: [string] # Blog slugs shown on the homepage
```

## Components & Storybook

- **Astro components** (`layout/`) are structural glue: `PaperSheet` (variants hero/skills/blog/projects; props: pattern, margin, torn, fullHeight, layer, padTopRules, per-color overrides), `Header`, `SectionHeader`. They cannot appear in Storybook.
- **React components** (`ui/`, `blog/`) are the visual primitives, statically rendered by Astro (no `client:*` except `BlogList`). Each has a co-located `.stories.tsx` with `tags: ["autodocs"]`. Storybook imports `global.css` (→ `notebook.css`) and loads the Google Fonts via `.storybook/preview-head.html`.
- Fonts (loaded in `BaseLayout.astro`): **Fraunces** (headings), **Newsreader** (body), **Spline Sans Mono** (nav/meta/pills), **Caveat** (signature). Legacy Inter/Space Grotesk/Space Mono are still loaded for the 404 page.

## SEO / Deployment

- OG tags per page in `BaseLayout`; blog posts use their banner as `og:image`.
- Sitemap via `@astrojs/sitemap`; RSS at `/rss.xml`; site URL `https://maxvandenhoven.com`.
- GitHub Actions on push to `main`: Node 24, `npm ci`, checks, build, deploy to GitHub Pages. CNAME in `public/`.
- `storybook-static/` is git-ignored and excluded from ESLint (`eslint.config.js` ignores) and typecheck (`tsconfig.json` exclude).

## Future Considerations

- **Projects section/page content** — design TBD (the hex grid is gone).
- **Ripped-paper PNG texture** — drop-in via `--nb-torn-mask`.
- **404 migration** to the notebook style (then delete the remaining legacy tokens/`btn-lift` and legacy fonts).
- **Dark mode** — not started; the notebook palette would need a dark set of `--nb-` tokens.
- **Footer** — currently a bare copyright line; social links from `homepage.yaml` are unrendered and could live there.
- Tag pages (`/blog/tag/[tag]`), analytics (self-hosted Umami), auto-featured content.
