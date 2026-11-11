# Style guide for artworks

These rules are distilled from the existing artworks in `content/`. When a rule conflicts with an existing artwork, copy what the artwork does and fix the rule.

## One idea, one mechanism

An artwork shows a single mechanism in motion. It is abstract and geometric, never a literal icon, logo, diagram with labels, or text. Each existing artwork can be summarized in one sentence:

| Entry                     | Scene                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Demand forecasting (blog) | Bars of past demand scroll toward a "now" line, then widen into forecast intervals   |
| Unprotected agents (blog) | Agents move inside rounded sandboxes, and one unguarded lane lets them wander out    |
| skill-evals (project)     | Rows of discs light up or stay eclipsed as an evaluation sweep passes                |
| hive (project)            | Hex tiles form a cluster as candidate placements are scored and the best is selected |
| imposter (project)        | Seats around a table give clues, vote with lines across it, and one is revealed      |
| This website (project)    | Markdown blocks build a static page, and only a few islands come alive               |
| AI agents (skill glyph)   | Four runs that pass or fail, drawn with eclipses                                     |
| Languages (skill glyph)   | A cursor walks a 3x3 grid and retypes each tile                                      |
| Infrastructure (skill)    | Three layers with a packet passing down through them                                 |
| Machine learning (skill)  | A short series of bars where the last one is the forecast                            |

The pattern is always the same: actors move through a structure, and one moment carries the meaning. Name that moment before writing code. A repeated, readable cycle works better than a one-off animation.

## Composition

- Start every frame with `P.background("ink")`. The `ink` key means no ink, so it paints the paper.
- Keep an empty border. Cards use `figurePadding(W, H)`, which is 9% of the shorter side. Glyphs use a margin of `W * 0.16` on a square canvas.
- Build the layout from `W` and `H`, never from fixed pixel values. Derive one cell size `c` from the available space, for example `Math.min((W - 2 * pad) / cols, (H - 2 * pad) / rows)`, and express every other size as a fraction of `c`. Center the result.
- Use a regular grid or a clear axis, with one element that breaks the pattern. That element is where the eye goes: the open lane, the red outlier, the "now" line, the cursor.
- Round everything. Rounded rectangles use a radius of 0.2 to 0.5 of their size, discs and hexagons come from `circle` and `hexagon`.
- Keep strokes at least one canvas pixel wide, for example `Math.max(1, c * 0.015)`. Details below about three canvas pixels disappear in the halftone.

## Color

The painter prints with three drums (a warm orange-red, a near-black and a yellow), and every ink is a mix of them. Use the named inks rather than inventing mixes.

| Ink             | Looks like                  | Typical use                                |
| --------------- | --------------------------- | ------------------------------------------ |
| `ink`           | Bare paper                  | Background only                            |
| `dim`           | A faint grey wash           | Soft bars, sweeps and shadows on paper     |
| `cream`         | Pale yellow                 | Small actors, highlights, forecast centers |
| `sun`           | Full yellow                 | Rare, strong highlight                     |
| `orange`        | Bright orange               | The main subject                           |
| `rose`          | Light warm pink             | Secondary lines and markers                |
| `red`, `ember`  | Full warm red (identical)   | The accent: failure, cursor, "now"         |
| `steel`         | Light grey-black tint       | Quiet structure                            |
| `slate`         | Medium grey-black           | Outlines and intervals                     |
| `navy`, `night` | Full near-black (identical) | Surfaces and shadows                       |

Use three to five inks per artwork. Let calm inks (`navy`, `slate`, `steel`, `cream`) carry the structure and reserve `red` or `orange` for the one thing that matters. Dark surfaces with light actors, or paper with dark and warm shapes, both occur in the existing set. Use the `alpha` option for fades and `tone` to nudge a tint a little darker or lighter. Avoid `over: true` unless two shapes should deliberately overprint.

## Motion

- Keep it slow and calm. A full cycle takes about 3 to 10 seconds, and the sine frequencies in the existing artworks are between about 0.5 and 1.7.
- Make it deterministic. Derive randomness from `hash(a, b, c)` or `seededRandom(seed)`, never from `Math.random()` or `Date.now()`. Every canvas then shows the same animation, and frames can be reproduced.
- Make it a function of the time `t`. Loops without a visible reset come from epochs: take `s = t * speed`, let `epoch = Math.floor(s)` and `f = s - epoch`, decide each outcome with `hash(..., epoch)`, and ease from the previous epoch's outcome to the current one with `ease(clamp(f, 0, 1))`. The skill-evals and AI agents artworks work this way.
- Keep state in the closure only when it is derived deterministically from the epoch, as hive does when it replays a game per epoch.
- Fade elements that enter or leave through the edges with `alpha`, so nothing pops.
- Set `startTime` when the first frame at `t = 0` would be empty or uninteresting.

## Cost

Figures redraw 20 times per second, and each fill is painted into three halftone layers. The sandboxes artwork draws about 120 shapes per frame. Stay below a few hundred, avoid allocating large arrays every frame, and keep figures at card size or article column width.

## Text that goes with the artwork

Each artwork has two pieces of prose.

- A one-line JSDoc above the motif that starts with the subject and a colon, for example `/** Demand forecasting: rounded bars of past demand scrolling toward a "now" line, followed by widening forecast intervals. */`.
- The `artwork_alt` frontmatter field, which repeats that sentence for screen readers. It is a single sentence in present tense without a trailing period. It describes what moves and what it means, without starting with "Illustration of". Skill glyphs are decorative and have no alt text.

## Common mistakes

- Drawing the topic instead of the mechanism, so the figure looks like a stock icon.
- Hard-coded pixel sizes that break at glyph size or in the article column.
- Too many inks or too many equally loud elements, so nothing is the focus.
- Hard resets at the end of a loop, or randomness that differs between frames.
- Details that vanish in the halftone, such as thin lines or tiny dots at 40 px.
