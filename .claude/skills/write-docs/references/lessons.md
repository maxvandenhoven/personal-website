# Lessons from the original run

These are the traps that came up while consolidating this repository's documentation. Check each one when you touch the docs again.

## Accuracy

- **Old docs repeat old designs.** The implementation prompts described a hex grid, modals and a `tailwind.config.ts` that no longer exist. The architecture file said deploys skip `.vscode/` when the workflow skips `.claude/**` and `docs/**`. Several pages still mentioned Storybook after it was removed. Read the source and search for names of removed tools.
- **Check what a workflow really does.** `deploy.yml` ignores pushes that only touch `docs/` or `.claude/`, so a docs-only merge does not deploy, while a change to `README.md` or `CLAUDE.md` does. A second workflow (`ci.yml`) existed and no page mentioned it.
- **Verify third-party claims.** The old setup guide said a `public/CNAME` file configures the custom domain. GitHub ignores that file for workflow-based Pages deployments, and the domain must be set in the repository settings. A short search of the official documentation caught it.
- **Rules enforced only in code need a page.** For example, a visible entry without an `artwork.ts`, a post with both a body and an external link, and a featured folder that does not exist all fail the build, but only the source said so.
- **Tooling pages must match the real globs.** The old docs said lint-staged ran on four file types, while `package.json` also formats Markdown and YAML.
- **Say when something is not true.** The project has no automated tests and no license file. The new pages say so.

## Process

- **Untracked files hide in plain sight.** The skills folder was untracked and its contents were easy to miss. Check `git status` early, and ask before committing material you did not write.
- **Empty folders are not tracked by git.** They show up only on disk. List them with `find . -type d -empty` and remove the unused ones. Be careful with empty folders inside other people's skill scaffolds.
- **Empty scaffolds do not survive branch switches.** After checking out `main`, which did not contain the tracked skills, the empty skill scaffolds that had been on disk were gone. Do not rely on empty folders staying put, and mention any you remove.
- **A squash merge hides your commits.** After the PR is merged, update `main` with `git fetch` and `git merge --ff-only origin/main`. A plain `git pull` can fail when several branches track different upstreams.
- **The user may widen the scope in the answer to the proposal.** In the original run, it added a skill for generating artworks and asked for the project background in the README. Fold such additions in without re-proposing them.

## Tooling traps

- **The formatter owns Markdown.** lint-staged runs Prettier on Markdown, so tables are realigned on commit. Run `npx prettier --write` on the new pages before the final check, so the diff does not change at commit time.
- **Everything in the repo is linted and type checked.** ESLint (`eslint .`) and `astro check` (`tsconfig.json` includes `**/*`) also cover `.claude/`. Scripts in a skill therefore need to be valid, formatted JavaScript or TypeScript. A Python script is outside both tools.
- **Documentation can leak into the CSS.** Tailwind scans source files for class names. The stylesheet excludes `docs/` with `@source not "../../docs"`. Other new Markdown locations, such as a root README, are scanned like any file, which is harmless but worth knowing.
- **Headless Chrome hangs on live-reload pages.** The artwork preview keeps an event stream open, and `google-chrome --headless --screenshot` did not return. Use the browser extension tools to look at a served page, and close the tab and the server afterward.
- **Do not `pkill -f` a word that is in your own command line.** Killing by the pattern `headless` ended the shell that carried it. Kill by process ID.

## Style

- **Follow the voice rules.** US spelling, no em dashes, few colons and semicolons, connected sentences and plain verbs. The checker flags em dashes.
- **Prefer tables for fields, commands and symptoms, and prose for reasons.** A table with a "Notes" column is where most reference details live.
- **One name per concept.** For example, always "entry" for a folder under `content/`, "artwork" for `artwork.ts`, "hosted" and "external" for the two kinds of blog post.
