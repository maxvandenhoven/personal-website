# Artworks

Every blog post, project and skill owns an animated illustration in an `artwork.ts` file next to its `index.md`. The site draws it on a canvas and prints it as a three-ink risograph. This guide explains the artwork API, the painter and the helpers, and how to preview what you write. Coding agents can use the `riso-artwork` skill, which turns a link or an idea into an artwork and previews it automatically (see the end of this page).

## What an artwork is

An artwork is a module that default-exports the result of `defineArtwork`. Its `create` function returns a motif, which is a function that draws one frame.

```ts
import { defineArtwork } from "@/lib/riso/artwork";
import { circle, figurePadding } from "@/lib/riso/geometry";
import type { Motif } from "@/lib/riso/motifs/types";

/** width and height are in canvas pixels. time is in seconds. */
const pulse: Motif = (painter, width, height, time) => {
  painter.background("ink");
  const pad = figurePadding(width, height);
  const r = (Math.min(width, height) / 2 - pad) * (0.8 + 0.2 * Math.sin(time));
  painter.fill(circle(width / 2, height / 2, r), "orange");
};

export default defineArtwork({ create: () => pulse });
```

The `Artwork` type has two members.

| Member      | Type               | Purpose                                                                          |
| ----------- | ------------------ | -------------------------------------------------------------------------------- |
| `create`    | `() => Motif`      | Called once for every canvas on the page, so a motif can keep state in a closure |
| `startTime` | `number`, optional | Offsets the clock in seconds, so the first frame already shows something         |

A `Motif` is `(painter, width, height, time) => void`. The width and height are the canvas size in device pixels, and the time is the number of seconds on the figure's own clock. The engine calls the motif about 20 times per second while the figure is on screen, so a motif must draw the entire frame every time, starting with `painter.background(...)`.

Most artworks wrap the motif in a function with an options object, so the numbers that tune the scene are named and easy to change.

```ts
interface TilesOptions {
  columns: number;
  speed: number;
}

function tiles({ columns, speed }: TilesOptions): Motif {
  return (P, W, H, t) => {
    // ...
  };
}

export default defineArtwork({
  create: () => tiles({ columns: 6, speed: 0.8 }),
});
```

## Where figures appear

| Entry                | Frame                          | Notes                                                                  |
| -------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| Blog post or project | 16:9, a card about 520 px wide | The same artwork also appears in the article column, up to 656 px wide |
| Skill                | Square, 40 px                  | A decorative glyph beside the title                                    |

The sizes in the motif must therefore come from `width` and `height` and never from fixed pixel values. Derive one cell size from the padded space and express everything else as a fraction of it.

## The painter

The painter splits every shape into three halftone layers, one for each ink drum, and composites them with grain and a slight misregistration. The calls below are the whole drawing vocabulary.

| Call                                       | Purpose                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| `background(ink)`                          | Fills the frame. Call it first, with `"ink"` for bare paper                     |
| `fill(path, ink, options?)`                | Fills a shape                                                                   |
| `clipFill(clip, path, ink, options?)`      | Fills `path`, but only where it falls inside `clip`                             |
| `stroke(path, ink, width, cap?, options?)` | Draws an outline. The width is in canvas pixels and the cap defaults to `round` |

The `options` object accepts three values.

- `alpha` from 0 to 1 scales the ink coverage, which is how you fade shapes in and out.
- `tone` nudges the halftone darker or lighter, by roughly 18% per step.
- `over` overprints the shape instead of knocking out what is underneath it.

Shapes are described by path functions. They add a sub-path to the canvas context, and the painter decides how to fill or stroke them. You can write one yourself, as in `(ctx) => { ctx.moveTo(...); ctx.lineTo(...); }`, but the helpers below cover most needs.

### Inks

Inks are named mixes of the three riso drums, which are a warm orange-red, a near-black and a yellow.

| Ink             | Mix                    | Looks like        |
| --------------- | ---------------------- | ----------------- |
| `ink`           | None                   | Bare paper        |
| `dim`           | 12% dark               | A faint gray wash |
| `steel`         | 45% dark               | Light gray-black  |
| `slate`         | 70% dark               | Medium gray-black |
| `navy`, `night` | Full dark              | Near-black        |
| `cream`         | 30% light              | Pale yellow       |
| `sun`           | Full light             | Yellow            |
| `rose`          | 40% warm               | Light warm pink   |
| `red`, `ember`  | Full warm              | Orange-red        |
| `orange`        | 75% warm and 70% light | Bright orange     |

`red` and `ember` print identically, as do `navy` and `night`. Both names exist so a motif can say what a shape means. The ink names come from the `COVERAGE` table in `src/lib/riso/painter.ts`, which is also where to add a new mix. The drum colors themselves come from the design tokens described in [`../design-system.md`](../design-system.md).

### Helpers

| Helper                                          | Module                      | Purpose                                                                |
| ----------------------------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| `circle(cx, cy, r)`                             | `@/lib/riso/geometry`       | A circle path                                                          |
| `roundedRect(x, y, w, h, radius)`               | `@/lib/riso/geometry`       | A rectangle with rounded corners                                       |
| `hexagon(cx, cy, r)`                            | `@/lib/riso/geometry`       | A pointy-top hexagon with softly rounded corners                       |
| `figurePadding(width, height)`                  | `@/lib/riso/geometry`       | The shared empty border, 9% of the shorter side                        |
| `hash(a, b, c)`                                 | `@/lib/riso/math`           | A deterministic float in [0, 1] from three integers                    |
| `seededRandom(seed)`                            | `@/lib/riso/math`           | A seeded random number generator                                       |
| `clamp(value, min, max)`                        | `@/lib/riso/math`           | Limits a value to a range                                              |
| `ease(f)`                                       | `@/lib/riso/math`           | Quadratic ease in and out on [0, 1]                                    |
| `drawEclipse(painter, x, y, r, offset, alpha?)` | `@/lib/riso/motifs/eclipse` | A lit disc partly covered by a dark one, used as a pass or fail marker |

## Rules of thumb

- **Be deterministic.** Use `hash` or `seededRandom` instead of `Math.random()` or `Date.now()`, so every canvas shows the same animation.
- **Loop without a reset.** Derive state from the time. A common pattern takes `epoch = Math.floor(time * speed)`, decides each outcome with `hash(..., epoch)` and eases from the previous epoch's outcome to the current one.
- **Keep it cheap.** Figures redraw every frame, and the cost grows with the figure's area and with the number of shapes. Keep figures at card size or at the width of the article column, and stay below a few hundred shapes.
- **Keep details visible.** Strokes need at least one canvas pixel, and tiny dots disappear in the halftone, especially at glyph size.
- **Reuse when it fits.** An entry can share another artwork with `export { default } from "../../projects/hive/artwork";`.

The `riso-artwork` skill has a longer [style guide](../../.claude/skills/riso-artwork/references/style-guide.md) that explains how to make a new artwork look like the existing ones.

## Alt text

Entries other than skills describe their artwork in an `artwork_alt` frontmatter field for screen readers. Write one sentence in present tense that says what moves and what it means, and keep it consistent with the comment above the motif.

## Previewing an artwork

The preview script bundles an artwork with the site's real painter and palette and serves it on a local page.

```sh
node .claude/skills/riso-artwork/scripts/preview.mjs content/projects/hive/artwork.ts
```

The page shows the artwork at card size, at article width or at glyph sizes, together with a timeline of six frames, and it offers play and pause, restart, speed and a time scrubber. It reloads whenever the file changes, and errors thrown by the motif appear at the top of the page. Pass `--port` to change the default port 4400. The script needs the dependencies from `npm ci`, because it uses the esbuild that comes with Vite.

The viewer repeats the engine's drawing loop in a small script, so it is worth glancing at `scripts/viewer.js` in the skill folder if `src/lib/riso/engine.ts` ever changes its frame rate or pixel ratio. Once the entry exists, `make dev` shows the artwork in its real card.

## Generating artworks with the skill

The `riso-artwork` skill in `.claude/skills/riso-artwork/` lets a coding agent create an artwork from a link, a piece of text or an idea. The agent reads the source, finds the mechanism the content is about, turns it into a scene, writes `artwork.ts` from a template, previews it in a browser and iterates until it fits the existing set. Ask for it in plain words, for example "make an artwork for this Xebia article" followed by the link, or "redo the artwork for hive".
