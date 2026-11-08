<img src="assets/logo.png" width="160" alt="Personal website logo">

# personal-website

My personal website brings together my projects, writing, and background. It is built with Astro, React, and TypeScript, with content stored in Markdown and YAML. The illustrations combine simple geometric shapes with layered ink effects inspired by risograph printing.

## Background

The site is a place to publish projects and writing, and it is also a side project in its own right. Content lives in Markdown and YAML files with schemas that the build validates, so a missing artwork or a broken featured entry fails the build instead of reaching the published pages. Astro produces plain static files that GitHub Pages can serve, which keeps hosting simple and leaves no server to maintain.

The risograph-inspired illustrations give the site a distinct look and a setting for experimenting with canvas rendering. Each entry owns a small animated artwork drawn through a shared painter that layers ink colors and halftone effects. Artwork modules load lazily and the renderer redraws only visible figures at a limited frame rate, so drawing cost is a design constraint on how large and complex a figure can be.

## Getting started

Use Node.js 24, the version selected by `.nvmrc` and the deployment workflow, and npm. The package declares a minimum Node.js version of 22.12.0. GNU Make is optional and provides shortcuts for the npm scripts.

From the repository root, install the locked dependencies and start the development server.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro, normally `http://localhost:4321`. The development command binds to all network interfaces, so it can also be reached from other devices when your network allows it. Draft entries are visible during development but excluded from production builds.

To build the static site and preview the result locally, run these commands instead.

```sh
npm run build
npm run preview
```

The build writes to `dist/`. Preview serves that output, so rebuild after changing content or source files.

## How it works

Astro generates the pages at build time. React components render to static HTML without client-side React hydration, while TypeScript controllers handle navigation, tag filters, motion controls, and canvas illustrations in the browser. Tailwind CSS and the design tokens in `src/styles/global.css` provide the site's styling.

The homepage selects entries from the content collections. The projects page lists projects alphabetically and links to their repositories, while the blog listing sorts posts newest first. A blog post can contain a locally hosted Markdown article or link to an external publication. Hosted posts receive their own pages, and the build also generates an RSS feed and sitemap.

| Location                | Purpose                                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| `content/`              | Site settings, homepage copy, entries, and their artwork                       |
| `src/content.config.ts` | Content schemas                                                                |
| `src/lib/content.ts`    | Filtering, sorting, and validation used by pages                               |
| `src/pages/`            | Page routes and the RSS endpoint                                               |
| `src/components/`       | React components and their Storybook stories                                   |
| `src/scripts/`          | Browser controllers                                                            |
| `src/lib/riso/`         | Canvas rendering, ink palettes, geometry, and shared motifs                    |
| `src/styles/global.css` | Design tokens and site styles                                                  |
| `public/`               | Files copied unchanged into the build, including the favicon and custom domain |

## Writing content

Edit `content/site.yaml` for site-wide settings, contact details, social links, and listing introductions. Edit `content/homepage.yaml` for the hero, About section, education, and featured entries. The portrait is `content/headshot.png`.

Each blog post, project, or skill category lives in its own folder under `content/blogs/`, `content/projects/`, or `content/skills/`. An entry combines an `index.md` file with frontmatter and a neighboring `artwork.ts`. Use an existing entry as a starting point, then consult the [content guide](docs/content.md) for required fields and examples.

For a blog post, either write the article in the Markdown body or provide an `external` URL and publication name with an empty body. A hosted post can also include a banner for link previews and an `images/` folder for inline images. Project bodies are not displayed, so project descriptions and links belong in frontmatter.

Add `draft: true` while working on an entry. To feature it on the homepage, add its folder name to the corresponding list in `content/homepage.yaml`, in display order. A production build fails if a featured entry is missing or still a draft. It also rejects visible entries without artwork and blog posts with both an external link and a body, or with neither.

## Creating artwork

Each entry's `artwork.ts` default-exports `defineArtwork({ create, startTime? })` from `@/lib/riso/artwork`. The `create` function returns a motif that draws a frame through the shared painter, using the canvas dimensions and time in seconds. Keeping state inside `create` gives each figure its own animation state. An entry can also re-export another entry's artwork.

The painter combines ink layers and halftone effects rather than drawing ordinary flat-color shapes directly. Shared geometry and math helpers live in `src/lib/riso/`. Artwork modules load lazily, and the renderer redraws visible figures at about 20 frames per second. Animations start paused for visitors who prefer reduced motion and can be paused with the site's motion control.

Run Storybook to inspect components and artwork independently of the pages.

```sh
npm run storybook
```

Storybook starts on port 6006. Open **UI → RisoFigure → All Artworks** to browse the illustrations, including drafts. The [artwork reference](docs/content.md#artworks-artworkts) covers the painter API, ink names, dimensions, and an example motif. Keep illustrations inexpensive to draw, especially when increasing their canvas size.

## Development

Run the report-only checks before building.

```sh
npm run lint
npm run format:check
npm run typecheck
npm run build
```

`make ci` runs linting, formatting checks, and type checking in that order. It does not build the site. For intentional fixes, `npm run lint:fix` and `npm run format` modify files. `make check` runs both of those auto-fix commands before type checking, so it is not a read-only check.

The Makefile also provides `make dev`, `make build`, `make preview`, `make storybook`, and `make storybook-build`. To generate a static component explorer directly with npm, run the following command.

```sh
npm run build-storybook
```

The result is written to `storybook-static/`. The pre-commit hook uses Husky and lint-staged to format staged files and apply lint fixes where configured. There is no automated test script in `package.json`, so linting, type checking, and successful builds do not replace checking the site and its interactions in a browser.

## Deployment

The repository's GitHub Actions workflow installs dependencies with Node.js 24, runs `make ci`, builds the site, and uploads `dist/` to GitHub Pages. It runs on pushes to `main` except when all changed paths are covered by its documentation and editor-configuration exclusions, and it can also be triggered manually.

`astro.config.ts` sets the site URL to `https://maxvandenhoven.com`, and `public/CNAME` supplies the custom domain. See the [GitHub Pages setup guide](docs/github-pages-setup.md) for the existing domain and deployment setup. Local development does not require configuring GitHub Pages or DNS.

## Limitations

This repository documents and implements my own site, not a general-purpose portfolio template. Reusing it means reviewing the personal content, links, domain configuration, and artwork rather than changing a single profile setting.

The site currently has a light theme only. Text and links are generated as HTML, but canvas artwork and interactive controls need JavaScript, and the fonts are loaded from Google Fonts. There is no server-side application or browser-based content editor. Content changes require rebuilding and redeploying the static files.

No license file is included in the repository. Do not assume an open-source license for the code, writing, images, or artwork.
