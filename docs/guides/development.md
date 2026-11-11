# Development

This guide takes you from a fresh clone to a pull request. It covers the setup, the commands, the checks that run before a commit and in CI, the code conventions and the most common changes. For how the pieces fit together, read [`../architecture.md`](../architecture.md) first or alongside it.

## Prerequisites

- Git and GNU Make. Make is optional, because every target is a thin wrapper around an npm script.
- Node.js 24, the version in `.nvmrc` and in both GitHub workflows. `package.json` accepts any Node 22.12 or newer, but 24 is the version that is tested.
- npm, which ships with Node.
- nvm is recommended. The pre-commit hook loads nvm from `~/.nvm` so that commits made from an editor use the right Node version.

## Setup

```sh
nvm install        # reads .nvmrc and installs Node 24 if it is missing
nvm use
npm ci
make dev
```

`npm ci` installs the exact versions from `package-lock.json` and, through the `prepare` script, installs the husky git hooks. `make dev` starts Astro's dev server, normally at `http://localhost:4321`. The script runs `astro dev --host`, so the server is also reachable from other devices on your network, such as a phone. Draft content is visible in the dev server and left out of production builds.

## Commands

| Command        | What it does                                                           |
| -------------- | ---------------------------------------------------------------------- |
| `make dev`     | Starts the dev server with hot reload                                  |
| `make build`   | Builds the static site into `dist/`                                    |
| `make preview` | Serves `dist/` locally, so run `make build` first                      |
| `make clean`   | Removes `dist/` and `.astro/`                                          |
| `make lint`    | Runs ESLint and only reports problems                                  |
| `make format`  | Runs Prettier and rewrites files                                       |
| `make type`    | Runs `astro check`, which type checks `.ts`, `.tsx` and `.astro` files |
| `make check`   | Fixes lint problems, formats files, then type checks                   |
| `make ci`      | Runs lint, a Prettier check and the type check without changing files  |

Two npm scripts back these targets and have no Make equivalent. `npm run lint:fix` runs ESLint with automatic fixes, and `npm run format:check` runs Prettier in report-only mode.

Use `make check` while you work, because it repairs what it can. Use `make ci` to see exactly what CI will see, since it never modifies files and fails on any problem.

## Checks

Three tools guard the code, and the same three run in the pre-commit hook and in CI.

- **ESLint** uses the flat config in `eslint.config.js`, with the TypeScript, React Hooks and Astro plugins. `eslint-config-prettier` turns off rules that would conflict with formatting. Unused variables are errors unless they start with an underscore.
- **Prettier** uses `.prettierrc` with the Astro and Tailwind plugins. The Tailwind plugin sorts class names, so write classes in any order and let the formatter order them.
- **`astro check`** type checks the whole project against `tsconfig.json`, which extends Astro's strict preset.

The husky pre-commit hook runs `lint-staged` on the files you staged. It fixes and formats `.ts`, `.tsx`, `.astro` and `.js` files, and formats `.css`, `.md`, `.yaml` and `.yml` files. It does not type check, so run `make type` or `make check` before you push.

The project has no automated test suite. Verification is the combination of `make ci`, a successful `make build` and looking at the result in `make dev` or `make preview`. When you change layout or styling, look at the page at phone width as well as desktop width.

## Code conventions

### TypeScript

- Strict mode is on, and `any` is not allowed.
- Prefer `interface` over `type` for object shapes.
- Use `.tsx` for React components and `.ts` for everything else.
- The `@/*` alias points to `src/*`. Artworks in `content/` use it to import from `@/lib/riso/...`. Code inside `src/` uses relative imports.

### Components

- Components live in `src/components/`, grouped by function in `ui/`, `layout/`, `home/`, `blog/`, `projects/` and `riso/`.
- Write one component per file, named in PascalCase after the component, and export it from the folder's `index.ts` barrel.
- Give each component a props interface and keep it free of state and effects. Components are rendered to static HTML by Astro and are never hydrated, so do not add `client:*` directives. Put behavior in a controller instead.
- Pages get their data from `src/lib/content.ts` and pass plain objects to components. Do not query content collections from a page or a component.
- Do not add an external UI library.

### Styling

Use the Tailwind theme tokens and named scales, and never write raw color values. [`../design-system.md`](../design-system.md) lists the tokens and the rules.

### Git

- Branch from `main`, for example `feat/dark-mode` or `fix/tag-filter`.
- Use conventional commit messages, such as `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:` and `chore:`.
- Open a pull request into `main`. The CI workflow runs on it. A merge to `main` deploys the site, as described in [`deployment.md`](deployment.md).

## Common changes

### Add a component

1. Create `src/components/<group>/<Name>.tsx` with an exported function component and a props interface.
2. Export it from `src/components/<group>/index.ts`.
3. Use tokens and named scales for styling.
4. Import it in a page or another component and check it at phone and desktop widths.

### Add a page

1. Create the file in `src/pages/`. The path becomes the route.
2. Wrap the content in `BaseLayout` and pass `title`, `description` and `currentPage` when the page belongs in the navigation.
3. Read data through a function in `src/lib/content.ts`. Add one there if none fits.
4. For a navigation entry, add it to `NAV_LINKS` in `src/lib/navigation.ts`.

### Add browser behavior

1. Create `src/scripts/<name>.ts` with a function that takes a root node, queries `data-*` hooks inside it, registers listeners with an `AbortController` and returns a cleanup function.
2. Add the matching `data-*` attribute to the component markup.
3. Register the controller in the `cleanups` list in `src/scripts/controllers.ts`.

### Add a social platform

Add the platform to `SOCIAL_PLATFORMS` and `SOCIAL_LABELS` in `src/lib/social.ts`, and an icon with the same name in `src/components/ui/Icon.tsx`. After that, `content/site.yaml` accepts it in `socials`.

### Change a token

Edit the `@theme` block in `src/styles/global.css`. If the token is an ink or the paper color read by the canvas renderer, edit the `@theme static` block instead. Artwork previews pick the change up automatically.

### Add content

Content changes need no code. See [`writing-content.md`](writing-content.md), and [`artworks.md`](artworks.md) for the animated illustrations.

## Troubleshooting

| Symptom                                         | Likely cause and fix                                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `astro check` reports missing content types     | Generated types in `.astro/` are stale. Run `make clean`, then `make dev` or `make type`       |
| The build names a file and field                | A schema in `src/content.config.ts` rejected it. Fix that frontmatter field                    |
| `Missing artwork: add content/...`              | A visible entry has no `artwork.ts`. Add one or mark the entry as a draft                      |
| `homepage.yaml shows ..., which does not exist` | A featured folder name is misspelled or is a draft                                             |
| The pre-commit hook does not run                | Run `npm run prepare` to reinstall husky                                                       |
| A commit fails with `command not found`         | The hook could not find Node. Check that nvm is installed at `~/.nvm` and that `nvm use` works |
| The dev server port is taken                    | Astro picks the next free port and prints it                                                   |
