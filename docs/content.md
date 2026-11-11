# Writing content

Everything on the site comes from `content/`. The schemas live in `src/content.config.ts`; this page describes them for authors. The build checks every file against its schema and fails with a message naming the file and field when something is wrong.

```
content/
├── site.yaml               # Site-wide settings
├── homepage.yaml           # Homepage text, and which entries the homepage shows
├── headshot.png            # Hero portrait
├── blogs/<slug>/           # One folder per blog post
│   ├── index.md
│   ├── artwork.ts
│   ├── banner.jpg          # Optional, hosted posts only
│   └── images/             # Optional, hosted posts only
├── projects/<slug>/        # One folder per project
│   ├── index.md
│   └── artwork.ts
└── skills/<slug>/          # One folder per skill category
    ├── index.md
    └── artwork.ts
```

The folder name is the entry's slug: it becomes the URL (`/blog/<slug>`) and is how `homepage.yaml` refers to the entry. Blog posts, projects and skills are self-contained: the listing pages show all of them, and `homepage.yaml` decides which ones the homepage shows.

## Drafts

Every blog post, project and skill accepts `draft: true`. Drafts appear while running `make dev` but are left out of the build, the RSS feed and the sitemap. Remove the field (or set it to `false`) to publish.

## Blog posts

A post is either **hosted** on this site, with the article as the Markdown body, or **external**, linking to where it was published. The build fails on a post with both a body and an external link, or with neither.

| Field          | Type               | Required | Notes                                                                            |
| -------------- | ------------------ | -------- | -------------------------------------------------------------------------------- |
| `title`        | string             | yes      |                                                                                  |
| `description`  | string             | yes      | Card text, page lead and meta description                                        |
| `reading_time` | string             | yes      | Shown as written, e.g. `10 min read`                                             |
| `tags`         | list of strings    | yes      | Topics for the blog filter, e.g. `AI agents`. Use the same spelling across posts |
| `publish_date` | date, `YYYY-MM-DD` | yes      | Shown on cards; the blog page sorts newest first. Quote it in YAML               |
| `external`     | `{ url, name }`    | no       | Makes the post external: the card links to `url` and reads "Read on `name`"      |
| `artwork_alt`  | string             | yes      | Screen reader description of `artwork.ts`                                        |
| `draft`        | boolean            | no       | Default `false`                                                                  |

A hosted post:

```markdown
---
title: Notes on running agents unattended
description: What I learned from leaving coding agents running overnight, and the guardrails that made it safe.
reading_time: 8 min read
tags:
  - AI agents
  - Sandboxing
publish_date: "2026-11-20"
artwork_alt: Agents moving inside rounded sandboxes, with one unguarded lane where agents wander out
---

The article starts here, in Markdown. Don't repeat the title as a heading: the page shows it already.
```

An external post (no body):

```markdown
---
title: 7 practical tips for demand forecasting
description: Seven lessons on validation, baselines and reproducible experiments.
reading_time: 10 min read
tags:
  - Machine learning
  - Forecasting
publish_date: "2026-09-03"
external:
  url: https://xebia.com/blog/7-practical-tips-for-demand-forecasting-experimentation-and-modeling/
  name: Xebia
artwork_alt: Rounded bars of past demand scrolling toward a now line, followed by widening forecast intervals
---
```

### Hosted posts: banner and images

- `banner.jpg` (or `.png`, `.webp`) next to `index.md` becomes the post's `og:image` for link previews. It is not shown on the page.
- Put inline images in `images/` and reference them relatively: `![Alt text](./images/diagram.png)`. They are optimized at build time, keep their natural size up to the width of the text column, and are centred when narrower.

### Supported Markdown

The article template styles all of the following:

| Element             | Markdown                                                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| Section headings    | `## Heading`, `### Subheading`, `#### Minor heading`                                                     |
| Emphasis            | `**bold**`, `_italic_`, `~~strikethrough~~`                                                              |
| Links               | `[text](https://example.com)`, `[text](/projects)`                                                       |
| Inline code         | `` `code` ``                                                                                             |
| Keyboard keys       | `<kbd>Ctrl</kbd>`                                                                                        |
| Lists, nested lists | `- item`, `1. item`, indent two spaces to nest                                                           |
| Task lists          | `- [x] done`, `- [ ] to do`                                                                              |
| Block quotes        | `> quoted text`                                                                                          |
| Code blocks         | Fenced with a language (` ```python `) for highlighting and a language label; long lines scroll sideways |
| Images              | `![alt](./images/file.png)`                                                                              |
| Tables              | GitHub-style; `---:` right-aligns a column. Tables are centred and scroll sideways when too wide         |
| Horizontal rules    | `---` on its own line                                                                                    |
| Footnotes           | `text[^1]` and `[^1]: The note.`; collected at the end of the article                                    |

Headings get anchors, so `/blog/<slug>/#section-title` links to a section.

## Projects

| Field             | Type            | Required | Notes                                                                 |
| ----------------- | --------------- | -------- | --------------------------------------------------------------------- |
| `title`           | string          | yes      |                                                                       |
| `monospace_title` | boolean         | no       | Default `false`; set the title in the mono font, for repository names |
| `description`     | string          | yes      | Card text                                                             |
| `github_link`     | URL             | yes      | Where the card links                                                  |
| `tags`            | list of strings | yes      | Topics for the projects filter                                        |
| `status`          | string          | yes      | Shown on the card, e.g. `Open source`, `In development`               |
| `artwork_alt`     | string          | yes      | Screen reader description of `artwork.ts`                             |
| `draft`           | boolean         | no       | Default `false`                                                       |

The projects page lists projects alphabetically by title. The Markdown body is not shown anywhere.

```markdown
---
title: skill-evals
monospace_title: true
description: A framework for evaluating agent skills across models and coding agents.
github_link: https://github.com/maxvandenhoven/skill-evals
tags:
  - AI agents
  - Evaluation
status: Open source
artwork_alt: Rows of discs that light up or stay eclipsed as an evaluation sweep passes
---
```

## Skills

A skill category on the homepage: a title, a small animated glyph (its `artwork.ts`, drawn about 40 px square) and a list of chips.

| Field   | Type            | Required | Notes            |
| ------- | --------------- | -------- | ---------------- |
| `title` | string          | yes      | e.g. `AI agents` |
| `items` | list of strings | yes      | Shown as chips   |
| `draft` | boolean         | no       | Default `false`  |

The glyph is decorative, so skills have no `artwork_alt`.

```markdown
---
title: Languages
items:
  - Python
  - SQL
  - TypeScript
---
```

## Artworks (`artwork.ts`)

Every visible blog post, project and skill needs an `artwork.ts` next to its `index.md`; the build fails without one. It default-exports an artwork: a function that draws one frame of the animation, which the site prints as a three-ink risograph.

```ts
import { defineArtwork } from "@/lib/riso/artwork";
import { circle, figurePadding } from "@/lib/riso/geometry";
import type { Motif } from "@/lib/riso/motifs/types";

/** width and height are in canvas pixels; time is in seconds. */
const pulse: Motif = (painter, width, height, time) => {
  painter.background("ink");
  const pad = figurePadding(width, height);
  const r = (Math.min(width, height) / 2 - pad) * (0.8 + 0.2 * Math.sin(time));
  painter.fill(circle(width / 2, height / 2, r), "orange");
};

export default defineArtwork({ create: () => pulse });
```

- `create` is called once per figure on the page, so an artwork can keep state in a closure (see `content/projects/hive/artwork.ts`). `startTime` (seconds) optionally offsets the clock so the first frame already shows something.
- Cards are 16:9; skill glyphs are square.
- Draw with the painter: `background(ink)`, `fill(path, ink, options?)`, `clipFill(clip, path, ink, options?)` and `stroke(path, ink, width, cap?, options?)`. Options are `alpha` (0–1), `tone` (nudges the halftone darker or lighter) and `over` (overprint instead of knocking out what's below).
- Inks are named mixes of the three riso drums: `ink` (paper), `dim`, `cream`, `sun`, `orange`, `ember`, `red`, `rose`, `steel`, `slate`, `navy` and `night`.
- Helpers: `circle`, `roundedRect`, `hexagon` and `figurePadding` in `@/lib/riso/geometry`; `hash`, `clamp`, `ease` and `seededRandom` in `@/lib/riso/math`; `drawEclipse` in `@/lib/riso/motifs/eclipse`.
- To reuse another entry's artwork, re-export it: `export { default } from "../../projects/hive/artwork";`.
- Keep artworks cheap: they redraw 20 times a second while on screen.

## `homepage.yaml`

A single entry with `id: config`. The lists of skills, projects and blogs name folders under `content/`, in the order they appear; the build fails on folders that don't exist or are drafts.

```yaml
- id: config
  hero:
    title: string
    description: string
    portrait_alt: string # Alt text for content/headshot.png
  about:
    title: string
    lede: string # Larger opening sentence
    paragraphs: # Plain text; inline [links](https://...) are supported
      - string
    education:
      title: string
      steps:
        - school: string
          degree: string
          description: string
    skills: # Folders in content/skills
      - languages
  featured_projects:
    title: string
    projects: # Folders in content/projects
      - skill-evals
  featured_blogs:
    title: string
    blogs: # Folders in content/blogs
      - the-risks-of-unprotected-agents-and-how-to-mitigate-them
```

## `site.yaml`

A single entry with `id: config`, used on every page.

```yaml
- id: config
  name: string # Header, footer and page titles
  description: string # Meta description of the homepage
  email: string # Shown in the footer
  socials: # Hero buttons and footer links
    - platform: github # github | linkedin
      url: https://...
  contact: # Footer
    title: string
    description: string
  projects_page:
    description: string # Meta description
    lead: string # Intro under the page heading
  blog_page:
    description: string # Also the RSS feed description
    lead: string
```

## What fails the build

- A frontmatter field that is missing, misspelled or of the wrong type (e.g. an unquoted date or an invalid URL)
- A visible entry without `artwork.ts`
- A blog post with both a Markdown body and `external`, or with neither
- `homepage.yaml` naming a folder that doesn't exist or is a draft
