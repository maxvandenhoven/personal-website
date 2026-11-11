# Writing content

Everything on the site comes from the `content/` folder, so adding or editing a blog post, a project or a skill never requires touching code. This guide describes every file and field. The schemas live in `src/content.config.ts`, and the build checks each file against them and fails with a message that names the file and the field.

## Layout

```
content/
├── site.yaml               # Site-wide settings
├── homepage.yaml           # Homepage text and the entries it features
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

The folder name is the entry's slug. It becomes the URL of a hosted post (`/blog/<slug>`) and is how `homepage.yaml` refers to the entry, so use lowercase words separated by hyphens. Entries are self-contained. The listing pages show all of them, and `homepage.yaml` decides which ones the homepage features.

## Drafts

Every blog post, project and skill accepts `draft: true`. A draft shows up under `make dev` but is left out of the build, the RSS feed and the sitemap. A homepage that features a draft fails the build. Remove the field, or set it to `false`, to publish.

## Blog posts

A post is either hosted on this site, with the article as the Markdown body, or external, linking to where it was published. The build fails for a post that has both a body and an external link, and for a post that has neither.

| Field          | Type               | Required | Notes                                                                            |
| -------------- | ------------------ | -------- | -------------------------------------------------------------------------------- |
| `title`        | string             | yes      |                                                                                  |
| `description`  | string             | yes      | Card text, page lead and meta description                                        |
| `reading_time` | string             | yes      | Shown as written, for example `10 min read`                                      |
| `tags`         | list of strings    | yes      | Topics for the blog filter. Spell and capitalize them the same way in every post |
| `publish_date` | date, `YYYY-MM-DD` | yes      | Shown on cards, and the blog page sorts by it, newest first. Quote it in YAML    |
| `external`     | `{ url, name }`    | no       | Makes the post external. The card links to `url` and reads "Read on `name`"      |
| `artwork_alt`  | string             | yes      | Screen reader description of `artwork.ts`                                        |
| `draft`        | boolean            | no       | Defaults to `false`                                                              |

A hosted post looks like this.

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

The article starts here, in Markdown. Do not repeat the title as a heading, because the page shows it already.
```

An external post has frontmatter only.

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

### Banner and images

- A `banner.jpg`, `.jpeg`, `.png` or `.webp` next to `index.md` becomes the post's `og:image` for link previews. It is not shown on the page.
- Inline images go in `images/` and are referenced relatively, as in `![Alt text](./images/diagram.png)`. They are optimized at build time, keep their natural size up to the width of the text column and are centered when narrower.

### Supported Markdown

The article template styles all of the following. Start sections at `##`, because the page already has its own heading and a `#` in the body is styled as a section heading.

| Element             | Markdown                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Section headings    | `## Heading`, `### Subheading`, `#### Minor heading`                                                             |
| Emphasis            | `**bold**`, `_italic_`, `~~strikethrough~~`                                                                      |
| Links               | `[text](https://example.com)`, `[text](/projects)`                                                               |
| Inline code         | `` `code` ``                                                                                                     |
| Keyboard keys       | `<kbd>Ctrl</kbd>`                                                                                                |
| Lists, nested lists | `- item`, `1. item`, indented by two spaces to nest                                                              |
| Task lists          | `- [x] done`, `- [ ] to do`                                                                                      |
| Block quotes        | `> quoted text`                                                                                                  |
| Code blocks         | Fenced with a language, such as ` ```python `, for highlighting and a language label. Long lines scroll sideways |
| Images              | `![alt](./images/file.png)`                                                                                      |
| Tables              | GitHub style, with `---:` to right-align a column. Tables are centered and scroll sideways when too wide         |
| Horizontal rules    | `---` on its own line                                                                                            |
| Footnotes           | `text[^1]` and `[^1]: The note.`, collected at the end of the article                                            |

Headings get anchors, so `/blog/<slug>/#section-title` links to a section.

## Projects

| Field             | Type            | Required | Notes                                                                      |
| ----------------- | --------------- | -------- | -------------------------------------------------------------------------- |
| `title`           | string          | yes      |                                                                            |
| `monospace_title` | boolean         | no       | Defaults to `false`. Sets the title in the mono font, for repository names |
| `description`     | string          | yes      | Card text                                                                  |
| `github_link`     | URL             | yes      | Where the card links                                                       |
| `tags`            | list of strings | yes      | Topics for the projects filter                                             |
| `status`          | string          | yes      | Shown on the card, for example `Open source` or `In development`           |
| `artwork_alt`     | string          | yes      | Screen reader description of `artwork.ts`                                  |
| `draft`           | boolean         | no       | Defaults to `false`                                                        |

The projects page lists projects alphabetically by title. The Markdown body of a project is not shown anywhere, so put everything in the frontmatter.

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

A skill category appears in the About section of the homepage as a title, a small animated glyph and a list of chips.

| Field   | Type            | Required | Notes                   |
| ------- | --------------- | -------- | ----------------------- |
| `title` | string          | yes      | For example `AI agents` |
| `items` | list of strings | yes      | Shown as chips          |
| `draft` | boolean         | no       | Defaults to `false`     |

The glyph is decorative, so skills have no `artwork_alt`. Its `artwork.ts` is drawn about 40 px square.

```markdown
---
title: Languages
items:
  - Python
  - SQL
  - TypeScript
---
```

## Artworks

Every visible blog post, project and skill needs an `artwork.ts` next to its `index.md`, and the build fails without one. Writing one is covered in [`artworks.md`](artworks.md). To reuse the artwork of another entry, re-export it.

```ts
export { default } from "../../projects/hive/artwork";
```

## Topics

Tags drive the filter on the projects and blog pages. The filter matches tags exactly, so `AI agents` and `AI Agents` become two separate filters. Reuse existing tags before inventing new ones, and keep them to topics such as `Machine learning` or `Security` rather than the technologies used. To see the tags in use, search the `tags:` lists in `content/projects/` and `content/blogs/`.

## Homepage

`content/homepage.yaml` is a single entry with `id: config`. The lists of skills, projects and blogs name folders under `content/`, in the order they should appear. The build fails for folders that do not exist or are drafts.

```yaml
- id: config
  hero:
    title: string
    description: string
    portrait_alt: string # Alt text for content/headshot.png
  about:
    title: string
    lede: string # Larger opening sentence
    paragraphs: # Plain text. Inline [links](https://...) are supported
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

The hero portrait is `content/headshot.png`. It is converted to WebP at several widths during the build.

## Site settings

`content/site.yaml` is a single entry with `id: config` that every page uses.

```yaml
- id: config
  name: string # Header, footer and page titles
  description: string # Meta description of the homepage
  email: string # Shown in the footer
  socials: # Hero buttons and footer links
    - platform: github # github or linkedin
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

## Writing style

Keep the descriptions on cards and the intros of the listing pages short and factual. The listing intros are one connected sentence that describes the projects or articles, without first-person narration and without repeating the About section. Coding agents should load the `writing-style` skill before writing or editing any of this copy.

## What fails the build

- A frontmatter field that is missing, misspelled or of the wrong type, such as an unquoted date or an invalid URL
- A visible entry without an `artwork.ts`
- A blog post with both a Markdown body and `external`, or with neither
- A `homepage.yaml` that names a folder that does not exist or is a draft
