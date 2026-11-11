# Deployment

This guide describes how a change reaches the live site at `maxvandenhoven.com`, how to confirm it worked and what to do when it does not. For the one-time Pages and DNS setup, see [`setup-github-pages.md`](setup-github-pages.md).

## How it works

Two GitHub Actions workflows live in `.github/workflows/`. Both install Node 24 with npm caching, run `npm ci`, run `make ci` and then `npm run build`. The only difference is what happens afterward.

| Workflow | File         | Triggers                                   | Result                                  |
| -------- | ------------ | ------------------------------------------ | --------------------------------------- |
| CI       | `ci.yml`     | Pull requests into `main`, or a manual run | Checks only, nothing is published       |
| Deploy   | `deploy.yml` | Pushes to `main`, or a manual run          | Checks, then publishes `dist/` to Pages |

Because both workflows run `make ci`, a pull request that passes CI will also pass the checks in the deploy workflow, unless the merge changes `main` in between. If any step fails, the deploy workflow stops before it publishes anything, so the live site always matches a commit that passed the checks.

The deploy workflow uploads `dist/` with `actions/upload-pages-artifact` and publishes it with `actions/deploy-pages`. It uses the `github-pages` environment, which shows the live URL on the run. Deployments run one at a time, and a newer deployment waits for the running one instead of canceling it. CI runs for the same branch cancel each other, so only the latest push is checked.

### Pushes that do not deploy

The deploy workflow ignores pushes that only change files under `docs/` or `.claude/`. A documentation-only merge therefore does not rebuild the site. Changes to `README.md` or `CLAUDE.md` do trigger a deploy, even though they do not affect the output. To deploy anyway, start the workflow manually.

## Releasing a change

1. Create a branch from `main` and make the change.
2. Run `make check` locally, then `make build` and `make preview` when the change affects pages or styling.
3. Push the branch and open a pull request into `main`. Wait for the CI workflow to turn green.
4. Merge the pull request. The push to `main` starts the deploy workflow.
5. Watch the run in the **Actions** tab. It normally finishes within a few minutes, and the run page links to the live site.

To publish again without a new commit, open **Actions**, choose **Deploy to GitHub Pages**, select **Run workflow** and pick `main`.

## Publishing content

New articles and projects are code changes like any other, so they follow the same flow. Remove `draft: true` from the entry's frontmatter, or add the entry and its folder name to `content/homepage.yaml`, and merge. The build excludes drafts from pages, the RSS feed and the sitemap, so removing the flag is the moment an entry becomes public.

## Checking a deployment

Locally, run `make build` and inspect `dist/`.

- `CNAME` should be in the root, because Astro copies `public/` unchanged.
- `sitemap-index.xml` should list every published page.
- `rss.xml` should contain every published post, with external posts linking to their original site.
- `blog/<slug>/index.html` should exist for each hosted post and not for external ones.

On the live site, check these items after a deploy.

- **HTTPS.** Open `https://maxvandenhoven.com` and confirm the lock icon.
- **The change itself.** Reload with the cache bypassed, because GitHub Pages serves files with a short cache lifetime.
- **404 page.** Visit a path that does not exist, such as `/does-not-exist`. GitHub Pages serves the site's own `404.html`.
- **Feeds.** Open `/rss.xml` and `/sitemap-index.xml`.

## Rolling back

Revert the offending commit or merge on `main` and push. The deploy workflow publishes the reverted state like any other change. Use a revert pull request when you want the checks to run first, or push the revert directly when the live site is broken.

## When a run fails

| Failing step                         | What it means and what to do                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                             | The lockfile and `package.json` disagree. Run `npm install` locally and commit the lockfile                                              |
| `make ci`                            | Lint, formatting or types failed. Run `make check` locally, review the changes and commit them                                           |
| `npm run build`                      | A schema or build rule failed. The message names the file and field. See the troubleshooting table in [`development.md`](development.md) |
| `actions/deploy-pages`               | Pages is not set to deploy from GitHub Actions, or the environment is misconfigured. Check **Settings > Pages**                          |
| The run is green but the site is old | The browser cache or a delayed deployment. Wait a minute and reload with the cache bypassed                                              |

The commit hook fixes formatting before commits, so a `make ci` failure on a pull request usually means the hook was skipped or the change was made on GitHub's web editor.
