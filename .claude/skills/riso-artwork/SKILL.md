---
name: riso-artwork
description: Create an animated risograph artwork (artwork.ts) for a blog post, project or skill on this website from a link, text or idea, and preview it live with the site's real painter. Use when asked to make, redo or tweak an artwork, illustration or glyph.
---

# Riso artwork

Every blog post, project and skill on this site owns an animated illustration in `artwork.ts`. This skill turns a piece of content, such as a link to an article, a repository or a plain idea, into an artwork that matches the existing ones, and shows it in a browser while you iterate.

The artwork API, painter methods, inks and helpers are documented in `docs/guides/artworks.md`. Read it before writing code. The visual rules that make artworks look like they belong together are in `references/style-guide.md`. Read that too, then read two or three existing artworks from `content/*/*/artwork.ts` that are closest to the new idea.

## Workflow

1. **Establish the target.** Find out which entry the artwork is for. Blog posts and projects get a 16:9 card artwork. Skills get a square glyph that is drawn at 40 px.
   - **The request names an existing entry** (a folder under `content/blogs/`, `content/projects/` or `content/skills/`, or a link that clearly belongs to one). Write `artwork.ts` in that folder.
   - **It does not.** Assume the user is trying out ideas. Write the artwork in the scratchpad directory (for example `<scratchpad>/<short-name>/artwork.ts`) and do not create anything under `content/`. The scratchpad is outside the repo, but the preview still resolves the site's imports. Once the artwork is done, ask the user whether they want it added to the project and, if so, where: which collection (`blogs`, `projects` or `skills`) and which slug. Only after they answer, create `content/<collection>/<slug>/artwork.ts`, move the file there, restart the preview on the new path and tell the user that `index.md` is still missing (see `docs/guides/writing-content.md`).
2. **Read the source.** For a link, fetch the page. For a repository, read its README. Write down, in two sentences, what the content is about and what its central mechanism is. If the source is too thin to find a mechanism, ask the user one focused question instead of guessing.
3. **Find the scene.** Turn the mechanism into one sentence of the form "actors do something on a structure, and a key moment happens". Show the process, not the topic. A forecasting article becomes bars scrolling toward a "now" line, not a chart icon. Check the sentence against `references/style-guide.md` and make sure the scene looks different from the existing artworks of the same collection.
4. **Write the artwork.** Copy `assets/template.artwork.ts` to the target path (the scratchpad for a trial, see step 1) and replace the scene. Keep the structure: an options interface, a function that returns a `Motif`, a one-line JSDoc, and `defineArtwork({ create })`.
5. **Preview and iterate.** Start the preview, look at it, adjust, and repeat.
6. **Finish.** Write the `artwork_alt` text, run the checks and report what you made. Leave the preview server running and give the user its link, so they can look at the artwork themselves.

## Previewing

The preview bundles the artwork with the site's own painter and palette, so it looks exactly like the site, and it reloads whenever the file changes.

```sh
node .claude/skills/riso-artwork/scripts/preview.mjs content/projects/my-project/artwork.ts
```

The script prints a local URL (default `http://127.0.0.1:4400`, change it with `--port`). Run it in the background so you can keep editing, and keep it running after you finish: the user checks the result in their own browser. Do not stop it unless the user asks. If port 4400 is taken by an earlier preview, pass `--port` with a free one. The page shows the artwork at card size, at article column width, or at glyph sizes, together with a timeline of six frames so a single screenshot shows how the animation develops. It also has play and pause, restart, speed and a time scrubber.

If browser tools are available, open the URL, take a screenshot and look at the card, the article view and the timeline. Check the console for errors. Without browser tools, give the user the URL and ask them to look and describe what they see. Use `--out <dir>` to write static files without serving, but note that browsers refuse to run the script from `file://`, so serve the folder with any static file server.

The preview never replaces a visual check on the real site. Once the entry exists, `make dev` shows the artwork in its card.

## Checklist before you finish

- The first frame already shows something (otherwise set `startTime`), and the loop never visibly jumps.
- The scene stays inside the padding at 16:9, and a glyph reads at 40 px.
- It uses at most five inks, and one accent marks the key moment.
- Nothing depends on `Math.random()`, `Date.now()` or the canvas size in pixels.
- There are no console errors in the preview.
- `artwork_alt` describes what moves and what it means, in one sentence without a trailing period, and matches the JSDoc line above the motif.
- Something is always moving. Check the timeline: several elements should change between frames, not just one.
- `make check` passes. It formats and lints the new file and typechecks the project. A trial in the scratchpad is not covered, so run it after the file has moved into `content/`.

## Report

Finish with a short message that states the scene in one sentence, the live preview link (the server is still running), the file path, the `artwork_alt` text to put in `index.md`, and anything the user still needs to do. For a trial in the scratchpad, end by asking whether to add it to the project and where (collection and slug). Otherwise mention steps such as adding `index.md` or featuring the entry in `content/homepage.yaml`.
