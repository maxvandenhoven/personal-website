# Architecture

This page explains how the site is put together and why. Read it before changing anything that crosses folders, such as a new content field, a page or a client-side behavior. The task-oriented guides in [`docs/guides/`](guides/) link back here for the details.

## Overview

The site is a static personal website with three pages, a homepage, a project listing and a blog. Astro generates plain HTML at build time, and GitHub Actions publishes the result to GitHub Pages. There is no server and no database.

All content lives in files under `content/`. Blog posts, projects and skills are folders with an `index.md` and an `artwork.ts`, and two YAML files hold the site-wide and homepage text. A schema in `src/content.config.ts` validates every file, so a mistake fails the build instead of reaching the published pages.

Pages are written as React components, but they are rendered to static HTML and never hydrated in the browser. Interactivity comes from a few small TypeScript controllers that attach to `data-*` attributes in that HTML. Styling uses Tailwind CSS v4 with a set of design tokens. The visual design is one calm column on paper-colored ground, with animated illustrations inside framed figures. Each illustration is drawn on a canvas and printed as a three-ink risograph, with halftone screens, ink grain and slight misregistration between the layers.

| Layer          | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Framework      | Astro 7, static output                                     |
| Components     | React 19, rendered to HTML at build time                   |
| Language       | TypeScript in strict mode                                  |
| Styling        | Tailwind CSS v4, design tokens in `global.css`             |
| Code highlight | Shiki, mapped to the design tokens                         |
| Content        | Markdown with frontmatter, YAML, Astro content collections |
| Tooling        | ESLint 10, Prettier, husky with lint-staged, Make          |
| Hosting        | GitHub Pages through GitHub Actions                        |

## Repository layout

```
personal-website/
├── content/                      # All site content, treated as data
│   ├── site.yaml                 # Site-wide settings and listing page copy
│   ├── homepage.yaml             # Homepage text and the entries it features
│   ├── headshot.png              # Hero portrait, optimized to WebP at build time
│   ├── blogs/<slug>/             # index.md, artwork.ts, optional banner.* and images/
│   ├── projects/<slug>/          # index.md and artwork.ts
│   └── skills/<slug>/            # index.md and artwork.ts
├── docs/                         # Documentation, including this page
├── public/                       # Files copied unchanged into the build (favicon, CNAME)
├── src/
│   ├── content.config.ts         # Collections and their schemas
│   ├── components/               # React components, rendered statically
│   │   ├── ui/                   # Primitives such as Card, Chip, Pill and RisoFigure
│   │   ├── layout/               # Header, NavMenu, Footer, Section and headings
│   │   ├── home/                 # Hero, AboutStory, StudyPath, SkillGrid
│   │   ├── blog/                 # BlogCard
│   │   ├── projects/             # ProjectCard
│   │   └── riso/                 # MotionToggle
│   ├── layouts/BaseLayout.astro  # <head>, header, footer and the client script
│   ├── lib/
│   │   ├── content.ts            # Build-time queries and card view models
│   │   ├── navigation.ts         # Navigation links and numbered section labels
│   │   ├── format.ts, tags.ts, social.ts, cx.ts
│   │   └── riso/                 # The risograph renderer
│   ├── pages/                    # Routes, plus the RSS endpoint
│   ├── scripts/                  # Client controllers
│   └── styles/global.css         # Design tokens, base styles and article prose
├── .github/workflows/            # ci.yml for pull requests, deploy.yml for main
├── .claude/skills/               # Agent skills, including riso-artwork
├── CLAUDE.md                     # Rules and commands for coding agents
└── Makefile                      # Shortcuts for every npm script
```

## From content to page

Every page follows the same path. Content files are loaded and validated, a library module turns them into plain data, a page picks what it needs, and components turn that data into HTML.

1. **Loaders and schemas.** `src/content.config.ts` defines five collections. `blogs`, `projects` and `skills` use the `glob` loader on `content/<name>/*/index.md`. `site` and `homepage` use the `file` loader on their YAML files, which requires an array of entries with an `id`, so both files contain one entry with `id: config`. Zod schemas check the frontmatter and fail the build with a message that names the file and field.
2. **Queries.** `src/lib/content.ts` is the only place that reads the collections. Pages call its functions, such as `getProjects()` and `getPosts()`, instead of querying collections directly. The module hides drafts in production, sorts entries, checks that every visible entry has an artwork, rejects blog posts that are inconsistent, and converts entries into view models like `ProjectSummary` and `PostSummary`. Those view models are plain objects, so components never depend on Astro's collection types.
3. **Pages.** A page in `src/pages/` awaits the queries it needs, wraps its output in `BaseLayout` and passes data to components.
4. **Components.** React components in `src/components/` receive props and return markup. They contain no state and no effects.
5. **Client script.** `BaseLayout` loads `src/scripts/main.ts` once per page. It attaches the controllers described below to the markup.

### Content model

| Collection | Location                   | Visible entries are sorted by | Used for                            |
| ---------- | -------------------------- | ----------------------------- | ----------------------------------- |
| `blogs`    | `content/blogs/<slug>/`    | `publish_date`, newest first  | Blog cards and article pages        |
| `projects` | `content/projects/<slug>/` | Title, alphabetically         | Project cards                       |
| `skills`   | `content/skills/<slug>/`   | Title, alphabetically         | Skill categories on the homepage    |
| `site`     | `content/site.yaml`        | Not applicable                | Name, contact, socials, page intros |
| `homepage` | `content/homepage.yaml`    | Not applicable                | Homepage copy and featured entries  |

Entries are self-contained and do not know whether the homepage features them. The homepage names folders in `about.skills`, `featured_projects.projects` and `featured_blogs.blogs`, in display order. `selectFeatured()` resolves those names and throws when a folder does not exist or is a draft. The field reference for authors is in [`guides/writing-content.md`](guides/writing-content.md).

These rules are enforced in code and fail the build.

- A visible entry without an `artwork.ts` throws in `requireArtwork()`.
- A blog post with both a Markdown body and an `external` link, or with neither, throws in `getBlogPosts()`.
- A featured folder that is missing or a draft throws in `selectFeatured()`.

Drafts are visible when `import.meta.env.DEV` is true, which is the case under `make dev`. They are left out of production builds, the RSS feed and the sitemap.

## Pages

| Route          | File                          | Contents                                                                                    |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| `/`            | `src/pages/index.astro`       | Hero, About with education and skills, featured projects, featured articles, contact footer |
| `/projects`    | `src/pages/projects.astro`    | Every visible project as a card, with a topic filter                                        |
| `/blog`        | `src/pages/blog/index.astro`  | Every visible article as a card, with a topic filter                                        |
| `/blog/<slug>` | `src/pages/blog/[slug].astro` | The article, generated only for posts hosted on this site                                   |
| `/rss.xml`     | `src/pages/rss.xml.ts`        | All published posts, with external ones linking to their original site                      |
| `/404`         | `src/pages/404.astro`         | A message and a link back to the homepage                                                   |

The homepage sections are numbered in the order they appear (`01 / About`, `02 / Projects`, `03 / Blog`, `04 / Contact`). The labels come from `src/lib/navigation.ts`, which the header and page headings share.

The listing pages build their topic filter from the tags of the entries on the page, through `collectTags()` in `src/lib/tags.ts`. A project card links to its repository. A blog card links either to its article page or to the external article.

An article page puts the heading, the artwork and the rendered Markdown into one centered column that is 680 px wide. The interactive dot-grid background is switched off on these pages so that long text stays easy to read, while the artwork still animates. If a `banner.jpg`, `.png` or `.webp` exists next to the post, it becomes the `og:image` and is not shown on the page.

## Client-side behavior

No React islands are hydrated. One bundled script, `src/scripts/main.ts`, calls `initControllers()` from `src/scripts/controllers.ts` and starts the page background. Each controller binds to `data-*` attributes in the server-rendered markup and returns a function that detaches it again.

| Controller or module       | Hook in the markup                          | Behavior                                                                |
| -------------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `scripts/tag-filter.ts`    | `[data-tag-filter]`, cards with `data-tags` | Single-select topic filter that updates the visible cards and the count |
| `scripts/motion-toggle.ts` | `[data-motion-toggle]`                      | Play and pause button in the header                                     |
| `scripts/nav-menu.ts`      | `[data-nav-menu]`                           | Menu button that replaces the inline links below 900 px                 |
| `lib/riso/engine.ts`       | `canvas[data-figure]`                       | Animates every figure and loads each artwork on demand                  |
| `lib/riso/background.ts`   | `[data-riso-background]`                    | Dot grid that warms up near the mouse, with touch and pen input ignored |

To add behavior, write a controller that takes a root node, queries its `data-*` hooks, uses an `AbortController` for listeners and returns a cleanup function. Then register it in `initControllers()`. [`guides/development.md`](guides/development.md) lists the steps.

## Risograph renderer

The renderer in `src/lib/riso/` is plain TypeScript on top of the 2D canvas API. It has no dependency on React or Astro.

| File                     | Responsibility                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `artwork.ts`             | The `Artwork` type and the `defineArtwork` helper                                                                    |
| `registry.ts`            | Finds `content/*/*/artwork.ts` with `import.meta.glob`, maps IDs like `projects/hive` to lazy loaders                |
| `painter.ts`             | Splits shapes into three halftone ink layers, then composites them with grain and misregistration (`PRINT_SETTINGS`) |
| `engine.ts`              | One animation loop that draws every visible figure                                                                   |
| `motion.ts`              | The shared paused state, which starts paused for visitors who prefer reduced motion                                  |
| `palette.ts`             | Reads the ink and paper colors from the CSS design tokens                                                            |
| `geometry.ts`, `math.ts` | Path helpers and small deterministic math helpers                                                                    |
| `motifs/`                | The `Motif` type and shared motifs such as the eclipse marker                                                        |

A `RisoFigure` component renders an empty `<canvas data-figure="projects/hive">`. When the page loads, the engine finds the canvas, asks the registry for the matching artwork, calls `artwork.create()` to get a motif, and draws it. Because the registry loads artworks lazily, a page only downloads the artworks it shows.

The engine draws figures only while they are on screen, with a 100 px margin, at 20 frames per second. The reduced rate is deliberate. It gives the prints the feel of hand-drawn animation on twos and keeps the page light. The device pixel ratio is capped at 1.5, and a figure repaints immediately when it is resized or paused. Rendering cost grows with the area of a figure, so figures stay at card size or at the width of the article column.

The palette comes from the design tokens `--color-riso-warm`, `--color-riso-dark`, `--color-riso-light` and `--color-art`. They live in a `@theme static` block so that Tailwind always emits them, because no class names reference them. Writing artworks is covered in [`guides/artworks.md`](guides/artworks.md).

## Styling

Tailwind v4 is configured in CSS rather than in a config file. The `@theme` block in `src/styles/global.css` holds the colors, type scale, spacing, radii, shadows and breakpoints, and components use the named scales instead of arbitrary values. `global.css` also contains the base layer and the `.prose` styles for articles, which cover headings, lists, quotes, images, code, tables and footnotes. [`design-system.md`](design-system.md) describes the tokens and the rules around them.

The stylesheet excludes `docs/` from Tailwind's source scan with `@source not "../../docs"`, so words in documentation never become generated classes.

## SEO and feeds

- **Metadata.** `BaseLayout` sets the title, description, canonical URL, Open Graph and Twitter tags. A page can override the canonical URL and pass an `ogImage`.
- **Site URL.** `https://maxvandenhoven.com`, configured as `site` in `astro.config.ts`.
- **Sitemap.** Generated by `@astrojs/sitemap` as `sitemap-index.xml`.
- **RSS.** `/rss.xml` lists every published post, using the description from `blog_page.description` in `site.yaml`.

## Build and deployment

Two GitHub Actions workflows run the same checks. `ci.yml` runs on pull requests to `main`, and `deploy.yml` runs on pushes to `main` and publishes the result. Both run `make ci` and `npm run build`. [`guides/deployment.md`](guides/deployment.md) describes the pipeline, and [`guides/setup-github-pages.md`](guides/setup-github-pages.md) covers the one-time Pages and DNS setup.

## Design decisions

- **Static first.** The site has no dynamic data, so pre-rendered HTML on GitHub Pages is the simplest thing that works and leaves nothing to maintain.
- **Content as files.** Markdown and YAML next to their artwork keep each entry self-contained and reviewable in a pull request. Schemas turn mistakes into build errors.
- **Components without hydration.** React gives a familiar component model for markup, while plain controllers keep the shipped JavaScript small. Only behavior that needs the browser ships to it.
- **Custom components.** There is no external UI library. The site is small, and owning the components keeps the visual design consistent.
- **Light mode only.** Every color goes through a token, so a dark theme needs new token values and a toggle, not a rewrite.
- **Cards instead of project pages.** Projects link to their repositories, and the listing pages are card grids with client-side filters.

## Future work

- A dark mode with alternative token values and a toggle in the header.
- A GitHub Action that keeps the featured lists in `homepage.yaml` up to date with the newest entries.
- Self-hosted analytics, for example Umami on the homelab.
- Static tag pages at `/blog/tag/<tag>` for search engines.
