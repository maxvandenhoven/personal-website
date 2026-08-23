# Handover — Notebook Redesign (for Fable)

You are picking up a website redesign already in progress. This document gives you
**all the context**: the original request, everything that's been built so far, and a
prioritized list of new changes and cleanup to do. Read it fully before editing.

The dev server runs at `http://localhost:4321` (`make dev`). Use the browser tools to
screenshot your work — this is a **highly visual** task and you must verify visually,
not just by building.

---

## 0. Project basics

- **Stack:** Astro 7 + React islands, TypeScript (strict), Tailwind CSS v4 (CSS-based
  `@theme`), Shiki, Storybook 10. Deployed to GitHub Pages.
- **Commands (Makefile):** `make dev`, `make build`, `make ci` (lint + format check +
  typecheck — must pass), `make check` (auto-fix + typecheck), `make storybook`.
- **Conventions:** conventional commits; no `any`; interfaces over type aliases;
  **never hardcode colors/values — use theme tokens**; components one-per-file,
  PascalCase; each React component gets a co-located `.stories.tsx` with
  `tags: ["autodocs"]`. See `CLAUDE.md` and `ARCHITECTURE.md`.
- **Reference file:** `notebook.html` in the repo root is the original design mock the
  redesign is based on. **It is the source of truth for the intended look**, including
  a baseline-grid technique (the `--u` unit) that is directly relevant to several tasks
  below. Re-read it.

---

## 1. The original request (verbatim)

> I want you to revamp the entire website style, including the main index page, the blog
> listing page, and the blog pages. The idea is to switch from a neobrutalist style to a
> notebook-like style. I want you to implement the following elements, where I will
> indicate what I want to be a component and what a parameter I can change in a central
> file:
>
> The header should be a ruler and slightly transparent (opacity should be parameter),
> with a white background (parameter), colored marks (parameter) that mimic the
> minor/major ticks of a real ruler. The header should be a component and should work on
> both mobile and desktop.
>
> The hero section should have a background that looks like ruled paper, with the
> background color (default beige), rule color (default gray), and margin color (default
> red) being configurable via parameters. On the left, there should be a tagline, where a
> word is highlighted. The font and highlight color should be parameters. Then under the
> tagline should be a short description. This font must also be configurable. Then
> underneath there must be a button with a CTA to go to the blog section, and a text link
> with an arrow beside it that scrolls to the projects section. The button should be a
> component and the background color must be configurable as a parameter. On the right
> side of the hero must be a polaroid-like image with a headshot, and some white margin
> below it to mimic a signature. At the top must be a pin to make it look like it is
> stuck, and the overall image should be tilted a bit. The entire thing must be a
> component, and the pin color and signature font must be configurable.
>
> The second section about the skills must again have a configurable background color,
> this time with a grid layout for the paper. There must be no margin, but the grid color
> must be configurable. By default the background should be white and the rule color the
> same as the hero. There must be a skills title, and an under title. The following
> sections will each have this, so there should be a shared section header and undertitle
> font that can be configured. Then under the undertitle must be sticky notes for each of
> the skill groups defined in the content/homepage.yaml. The sticky note must look
> realistic, with the top stuck down and then a slightly lifted look for the rest of the
> sticky note. The sticky note must be a component with configurable background color,
> title font, and skill list font.
>
> The blog section follows the same layout as the skills section, with a title and
> undertitle. The background should be light blue by default, with again ruled paper. The
> margin and grid color should be configurable using a distinct parameter from the
> previous sections. The title font is shared, but the rule and background colors not. For
> each blog that is highlighted, there should be a card. The card is naturally a
> component, and consists of a header, a title, a description, a reading time and date, and
> some skill pills. The top of the card stock should have a piece of tape. Naturally the
> colors and fonts of the parts of this component should be configurable.
>
> Finally for the projects section, there should be a black background by default, with an
> isometric grid. For now you can leave this section empty, but keep the title and subtitle
> with the appropriate spacings (should be consistent and configurable in each section by
> the way).
>
> When doing this overhaul, do not focus on the existing code too much, as it is very
> messy. I want clearly structured, reusable components for the things that I mentioned,
> and a centralized definition for all variables. I want to avoid hardcoded values and
> colors as much as possible, to avoid having to change something at multiple locations.
> Let's start with the hero section, and keep the blog listing and blog page as-is for
> now, we will do those later.
>
> To help you get started I have notebook.html. This contains some default colors and
> layouts you can use, but make sure to productionize this by converting to proper
> components. Also consistently comment on components to make it clear how to use them.
> Also note the transitions between the sections. The idea is to make it look like the
> sections overlap as pieces of paper that lie on top of each other. The texture is a
> placeholder for when I later add a PNG texture with actual ripped paper, where the paper
> will be colored according to the background with a rough edge and transparent bottom to
> overlap with the following section. Make sure to use consistent spacing for this.

Follow-ups already given by the user during the first sessions:

- "The margin should cover the entire background of the section, not just the text." →
  done (full-height margin rule).
- "Yes continue to the skills and blog section. Make sure the transition between sections
  works like in the notebook.html file." → done.
- "The grids on the background do not extend onto the ripped transition… Make sure the
  rules continue to the edge." → attempted (see §3, item 1 — **still not right, must be
  overhauled**).

---

## 2. What has been built so far (current state)

### Architecture decisions in force

- **Single central config: `src/styles/notebook.css`.** Every color, font, spacing value
  and per-component default is a commented CSS variable prefixed `--nb-`. This is THE file
  the user changes for global defaults. Components read these via `var(--nb-…)` and expose
  props that override a single instance by setting the same variable inline. **Keep this
  discipline — no hardcoded values.**
- The old **neobrutalist** design tokens and utility classes still live in
  `src/styles/global.css` because the **blog listing page, blog post page, projects page,
  and 404 page have NOT been migrated yet** (per the user's "keep blog as-is for now").
  Do not break them.
- **New notebook components are Astro** (server-rendered, content-driven). This means they
  currently have **no Storybook coverage** (Storybook here only supports React `.tsx`).
  See §3 "Storybook" for the required change.

### Fonts (loaded in `BaseLayout.astro` via Google Fonts)

Notebook theme uses: **Fraunces** (headings/tagline), **Newsreader** (body), **Spline
Sans Mono** (eyebrows/meta/pills), **Caveat** (signature). Legacy fonts (Inter / Space
Grotesk / Space Mono) are still loaded for the un-migrated blog pages.

### Files created

| File                                        | Purpose                                                                                                                                                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/notebook.css`                   | **Central config** + all notebook CSS (tokens, typography, paper patterns, torn edge, ruler, buttons, polaroid, sticky note, taped card, section header, responsive).                                                                    |
| `src/components/layout/Header.astro`        | Sticky "ruler" header with minor/major tick marks; mobile hamburger + desktop links. Params: `--nb-ruler-bg`, `--nb-ruler-opacity`, `--nb-ruler-tick`.                                                                                   |
| `src/components/layout/PaperSheet.astro`    | Section wrapper: paper background (`ruled`/`grid`/`iso`/`none`), optional full-height margin rule, optional torn bottom edge, optional `fullHeight`. Maps `variant` (hero/skills/blog/projects) → palette; per-instance color overrides. |
| `src/components/layout/TornEdge.astro`      | The ragged bottom edge. Currently renders the sheet's own paper pattern (bottom-anchored) masked into a ragged SVG silhouette; shadow on the wrapper. Meant as a **placeholder for a future ripped-paper PNG**.                          |
| `src/components/layout/SectionHeader.astro` | Shared eyebrow + title + undertitle, spaced by `--nb-header-gap`. `tone="light"` for dark sheets.                                                                                                                                        |
| `src/components/ui/NotebookButton.astro`    | CTA button. Params: `bg`, `text`.                                                                                                                                                                                                        |
| `src/components/ui/Polaroid.astro`          | Pinned, tilted headshot with signature margin. Params: `pinColor`, `signature`, `tilt`, `size`.                                                                                                                                          |
| `src/components/ui/StickyNote.astro`        | Sticky note for a skill group. Params: `bg`, `tilt`, `titleFont`, `listFont`.                                                                                                                                                            |
| `src/components/blog/TapedBlogCard.astro`   | Blog card with tape strip. Params: `bg`, `tilt`.                                                                                                                                                                                         |

### Files modified

- `src/styles/global.css` — imports `notebook.css`; legacy `@theme` + utility classes kept.
- `src/layouts/BaseLayout.astro` — loads notebook fonts; renders `<Header>`; added
  `siteName` prop.
- `src/pages/index.astro` — hero, skills, blog, projects rebuilt with the new components.
  Removed the old DotGrid hero, the marquee ribbon, and the hero social buttons.
- `content/homepage.yaml` + `src/content.config.ts` — added `hero_highlight`,
  `skills_title`, `blog_title`, `blog_description`, `projects_title`,
  `projects_description`.

### How the torn-paper transition currently works (important for task 1)

Each section is a `.nb-sheet`. A torn sheet gets `margin-bottom: -var(--nb-torn-overlap)`
so it overhangs the next sheet. The section paints its ruled/grid background (now
**bottom-anchored**, `background-position: bottom`). `TornEdge` renders a
`.nb-torn__fill` layer with the **same** paper pattern (also bottom-anchored, so it lines
up) masked into the ragged silhouette, at `z-index: 3` so it overhangs the next sheet;
the next sheet's opaque background hides the current sheet's straight rectangular bottom.
The shadow is a `filter` on the `.nb-torn` wrapper so it follows the masked ragged edge.

**This works but the user says it still doesn't look right (task 1).**

### What currently works / is verified

Hero (beige ruled, full-height red margin, highlighted word, CTA + text link, pinned
tilted polaroid with signature), skills (white grid, sticky notes), blog (blue ruled,
teal margin, taped cards), projects (black isometric, header only). All four sheets stack
with torn transitions. `make ci` and `make build` pass.

---

## 3. Your tasks

Work through these. After each visual change, **screenshot and verify** at desktop
(~1280px) and mobile (~400px) widths. Keep everything driven by `notebook.css` tokens —
if you introduce a new magic number, make it a variable. Keep the thorough component
comments.

### A. Cleanup (do this first, it de-risks the rest)

1. **Audit and remove genuinely orphaned code** introduced or left dangling by the
   redesign. Confirmed candidates (verify usage before deleting):
   - `marquee_skills` in `content/homepage.yaml` and its schema in `content.config.ts` —
     no longer rendered anywhere. Remove.
   - `DotGrid` (`src/components/ui/DotGrid.tsx` + its export in `ui/index.ts`) — the hero
     no longer uses it; grep shows no remaining consumer. Remove if truly unused.
   - Do **NOT** remove `BlogCard`, `BlogList`, `Tag`, `HexButton`, `HexGrid` blindly:
     `src/pages/blog/index.astro`, `src/pages/projects.astro`, and `404.astro` still use
     the old neobrutalist components/classes (`card-lift`, `btn-lift`, `tag-lift`). Those
     pages are **intentionally not migrated yet**. Keep them building.
2. **Consistency pass** over the new components/CSS: uniform comment style, no dead
   variables, consistent prop naming, sensible defaults. Ensure every configurable value
   the user mentioned is actually a token in `notebook.css`.
3. Keep `make ci` green throughout.

### B. Storybook

The user wants the Storybook storyboards updated. Storybook here only supports **React
`.tsx`** components (Astro components can't be stories — see `CLAUDE.md`). Recommended
approach:

- **Convert the reusable visual primitives to React `.tsx`**: `Polaroid`,
  `NotebookButton`, `StickyNote`, `TapedBlogCard`, and a small `Pill` component. Astro can
  render React components statically (no `client:*` needed), so `index.astro` keeps
  working. Add a co-located `.stories.tsx` (with `tags: ["autodocs"]`) for each,
  exercising the configurable props (colors, tilt, fonts).
- Keep **structural/layout** components as Astro (`Header`, `PaperSheet`, `TornEdge`,
  `SectionHeader`) — they're content/layout glue and not Storybook-friendly.
- Update or remove **stale stories**: `BlogCard.stories.ts`, `HexButton.stories.tsx`,
  `Tag.stories.tsx` — reconcile with whatever you keep/remove in step A.
- Verify with `make storybook` (or `make storybook-build`).

> If you think converting to React is the wrong call, raise it — but the user explicitly
> asked for Storybook coverage, and React is the only path to it in this repo.

### C. Visual / design changes

1. **Overhaul the ripped-paper transition (grids still wrong).** The grids/rules still
   don't look right across the tear. Re-architect the tear so it is **ready for the real
   ripped-paper PNG texture** the user will add later (a ragged strip, tinted to the
   section's background color, transparent below the rip so it overlaps the next section)
   **while the grid/rules extend cleanly all the way to the torn edge**. Requirements:
   - Grid/rules must reach the ragged edge with no flat band and no visible seam/jog.
   - The mechanism must let you later **drop in a PNG** (swap the ragged SVG mask for the
     PNG's alpha, or overlay the PNG tinted via `mask-image` + `background-color`) with
     minimal change — isolate this in `TornEdge.astro` / a dedicated background layer.
   - Solve stacking so an earlier sheet always overhangs the next (consider a dedicated
     absolutely-positioned `.nb-sheet__bg` layer masked at the bottom + explicit per-sheet
     `z-index`/`layer` ordering, instead of relying on the next sheet to hide the straight
     bottom).
   - Must look right at all widths. See `notebook.html` for the intended result.
2. **Hero tagline highlight — make it realistic.** Current `.nb-mark` is a flat rounded
   rectangle. Make it read like a real highlighter/marker swipe: semi-transparent with
   `mix-blend-mode: multiply`, slightly uneven/rough edges, a small skew/rotation, and
   overshoot past the text. Keep the color configurable via `--nb-highlight`.
3. **Polaroid — realistic pin and shadow.** Replace the flat pin with a believable
   push-pin (domed head with a specular highlight and its own small cast shadow; consider
   an SVG). Replace the single box-shadow with a layered, directional shadow (soft ambient
   - tighter contact shadow) so the photo reads as lifted off the page. This is the
     **shadow quality bar** to match elsewhere.
4. **Remove eyebrows/role tags.** Remove the `job_title` role tag above the hero tagline
   ("SOFTWARE ENGINEER") **and** the eyebrow labels above every section title
   ("01 — SKILLS", "02 — BLOG", "03 — PROJECTS"). Stop passing `eyebrow` in `index.astro`;
   you may keep the prop optional in `SectionHeader` or remove it entirely.
5. **Sticky notes — more realistic.** Improve the lift/curl (the bottom peeling off the
   page), shadow realism (match the polaroid bar), the adhesive line at the top, and add
   subtle paper feel. Avoid the current "flat rectangle + ellipse shadow" look.
6. **Taped blog card — better tape + realistic shadows.** Make the tape look like real
   washi/masking tape (translucent, slightly rotated, soft edges/torn ends, subtle sheen
   and shadow) instead of a flat semi-transparent block. Bring the card's shadow up to the
   polaroid's realism bar.
7. **Blog card ordering — pills at the bottom.** The card content is currently out of
   order. Reorder so the **tag pills sit at the very bottom** of the card (below the
   reading-time/date meta). Keep cards in a row aligned at the bottom.
8. **Overall proportions — the header is too small.** Increase the ruler header's height
   and presence (`--nb-header-h`, tick sizes, nav type). Rebalance the hero and section
   proportions to feel more substantial.
9. **Baseline-grid alignment of section titles.** Align the section titles (and ideally
   body text) to the background grid lines, and **scale the grid line spacing (`--nb-rule`)
   slightly so it matches the title's line-height**. `notebook.html` does exactly this
   with its `--u` unit (heading line-heights are whole multiples of `--u`, headings nudged
   with `translateY` so caps/baselines land on rules). Port that technique. Constraints:
   it must stay **consistent and realistic across screen sizes** (don't let the grid get
   absurdly large or tiny on mobile), and the goal is **more legible headings and a more
   realistic notebook**.
10. **Section spacing — fill the screen, more substantial sections.** Tune spacing so each
    section header comfortably fills the viewport on first view, and sections don't feel
    cramped (the skills section is currently far too short). Consider a sensible
    `min-height` for non-hero sheets and more generous `--nb-section-pad-y`. Keep the
    spacing **consistent and token-driven** across all sections.

---

## 4. Guardrails & tips

- **Verify visually.** Use the dev server + browser screenshots at desktop and mobile.
  The screenshot tool captures at a fixed logical width, so use `resize_window` and also
  sanity-check responsive breakpoints by reading the CSS.
- **Everything through `notebook.css` tokens.** No hardcoded hex/px in components. New
  knobs → new documented `--nb-` variables.
- **Don't regress the un-migrated pages** (blog listing, blog post, projects, 404). They
  stay neobrutalist until a later pass. Just keep them building and not visually broken by
  shared changes (header/layout/fonts).
- **The user is strong at SWE but newer to web** and values simplicity and consistency.
  Prefer clear, well-commented, centralized solutions over clever ones.
- Run `make ci` before finishing; run `make build`; skim `make storybook`.
- Commit with conventional-commit messages; you're on branch `feat/redesign`.
