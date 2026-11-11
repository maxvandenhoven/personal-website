<p align="center">
  <img src="public/favicon.svg" width="96" alt="" />
</p>

# personal-website

The source of [maxvandenhoven.com](https://maxvandenhoven.com), a personal website that brings together projects, writing and background in one place. It is built with Astro, React and TypeScript and styled with Tailwind CSS. Its illustrations are animated canvases printed as three-ink risographs.

## Background

The site started from the wish for an online platform that hosts all of my work in one place, and as an excuse to experiment with building a custom website instead of picking a template. That explains several choices. Content lives in Markdown and YAML files with schemas that the build validates, so a missing artwork or a broken featured entry fails the build and never reaches the published pages. Astro produces plain static files that GitHub Pages can serve, which leaves no server to maintain. The components are written from scratch rather than taken from a UI library, which keeps the design consistent and makes the code easy to experiment with.

The risograph illustrations are the main experiment. Each skill, blog post and project owns a small animated artwork that is drawn through a shared painter, which layers ink colors and halftone screens on a canvas. Artworks load lazily and only redraw while visible at a limited frame rate, so drawing cost is a real constraint on how large and complex a figure can be.

## Getting started

You need Node.js 24, the version in `.nvmrc`, and npm. GNU Make is optional and provides shortcuts for the npm scripts.

```sh
npm ci
make dev
```

Open the address that Astro prints, normally `http://localhost:4321`. Draft content is visible in the dev server and left out of production builds. To build the static site into `dist/` and look at the result, run these commands.

```sh
make build
make preview
```

Run `make check` to fix lint and formatting problems and to type check, and `make ci` to run the same report-only checks as the GitHub workflows.

## How it works

Astro generates every page at build time. Content comes from the `content/` folder, validated by the schemas in `src/content.config.ts`. React components render to static HTML without hydration, and small TypeScript controllers add the interactive parts, such as the topic filters and the animation controls. A blog post is either written as Markdown and hosted on the site, or it links to an article published elsewhere.

| Location                | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `content/`              | Site settings, homepage copy, and every entry with its artwork |
| `src/content.config.ts` | Content schemas                                                |
| `src/lib/content.ts`    | Queries, sorting and validation used by the pages              |
| `src/pages/`            | Routes and the RSS endpoint                                    |
| `src/components/`       | React components                                               |
| `src/scripts/`          | Browser controllers                                            |
| `src/lib/riso/`         | The risograph renderer                                         |
| `src/styles/global.css` | Design tokens and article styles                               |
| `public/`               | Files copied unchanged into the build, such as the favicon     |

## Documentation

| Page                                                         | Read it to                                                |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| [Architecture](docs/architecture.md)                         | Understand how the pieces fit together and why            |
| [Design system](docs/design-system.md)                       | Use the design tokens and styling rules                   |
| [Development guide](docs/guides/development.md)              | Set up, run the checks and make common changes            |
| [Writing content](docs/guides/writing-content.md)            | Add blog posts, projects and skills, or edit the homepage |
| [Artworks](docs/guides/artworks.md)                          | Write and preview an animated artwork                     |
| [Deployment](docs/guides/deployment.md)                      | Release a change and verify it                            |
| [Setting up GitHub Pages](docs/guides/setup-github-pages.md) | Configure Pages, DNS and HTTPS for the custom domain      |

## Working with coding agents

`CLAUDE.md` holds the rules and commands that coding agents follow in this repository. The `.claude/skills/` folder contains skills for recurring tasks, including `riso-artwork`, which creates an artwork from a link or an idea and previews it live.
