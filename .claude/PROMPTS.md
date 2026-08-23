# Implementation Prompts

Prompts for future Claude Code sessions. Each is self-contained; CLAUDE.md and
ARCHITECTURE.md provide the context. The original build phases (tooling,
content pipeline, component library, and the 2026-08 notebook redesign of the
homepage, blog listing, blog posts, and projects page) are **done** — see git
history and ARCHITECTURE.md for the current state.

Ground rules for every visual session: run `make dev`, verify with browser
screenshots at desktop AND mobile widths, keep every value a documented
`--nb-` token in `src/styles/notebook.css`, preserve the baseline-grid
alignment (measure baselines in the browser, don't eyeball), and keep
`make ci` + `make build` green.

---

## Remaining work

### 404 page migration

```
Migrate src/pages/404.astro from the old neobrutalist style to the notebook
style: a PaperSheet (pick a fitting variant/pattern), SectionHeader or nb-h1
typography, and a NotebookButton linking home. Afterwards, delete everything
that is then unused: the legacy @theme tokens and btn-lift styles in
src/styles/global.css, and the legacy Google Fonts (Inter / Space Grotesk /
Space Mono) in BaseLayout.astro. Verify nothing else references them and that
make ci and make build pass.
```

### Projects section content

```
Design and build the projects section (homepage sheet + /projects page). The
old hex-grid concept was removed with the notebook redesign; propose something
that fits the notebook language on the black isometric sheet (e.g. index
cards, photo prints, or taped clippings). Content comes from
content/projects/[slug]/ (schema in ARCHITECTURE.md; background_color /
foreground_color are currently unused and may be repurposed or removed).
Reuse the shadow tokens and rotation policy (elements straight, only
tape/pins rotated).
```

### Ripped-paper PNG texture

```
Replace the placeholder SVG tear silhouette with a real ripped-paper texture.
The whole mechanism is behind --nb-torn-mask in src/styles/notebook.css: the
mask needs black where paper is kept, transparent below the rip, and it is
stretched to 100% width x --nb-torn-height. Verify the deckle-lip drop-shadow
chain on .nb-sheet--torn > .nb-sheet__bg still reads well with the new edge,
at desktop and mobile widths.
```

### Footer + social links

```
The footer is a bare copyright line and the social links in
content/homepage.yaml (github_link, linkedin_link, twitter_link, email_link)
are not rendered anywhere since the redesign. Design a notebook-style footer
in BaseLayout.astro that uses them.
```

### Dark mode

```
Add a dark notebook palette. All colors live as --nb- tokens in
src/styles/notebook.css; add a dark token set and a toggle in the ruler
Header. Watch the places where colors are baked into data-URIs (the .nb-select
chevron, --nb-paper-grain) and the mix-blend-mode: multiply highlighter, which
behaves differently on dark paper.
```
