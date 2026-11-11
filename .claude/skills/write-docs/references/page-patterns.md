# Page patterns

These are the page types that the documentation of this repository uses. Reuse the structure for new pages and adapt the sections to the subject. A section that has nothing to say is left out, never filled with filler.

## Architecture page

The audience is someone who needs to change something that crosses folders. It explains how the system is put together and why.

1. **Overview.** What the system is, what it runs on and its main constraint, followed by a stack table.
2. **Repository layout.** An annotated folder tree with one comment per entry.
3. **How data flows.** The path from source to output as numbered steps, naming the file that does each step.
4. **Domain model.** A table of the main entities with their location, ordering and use, then the rules the code enforces and what happens when one is violated.
5. **Entry points.** A table of pages, routes or commands with the file behind each.
6. **Subsystems.** One section for each part with its own logic, such as client-side behavior or a renderer. Each has a table of files and responsibilities and a paragraph on the constraints that shaped it.
7. **Cross-cutting concerns.** Styling, SEO, build and deployment, each in a few lines that link to the page that owns the detail.
8. **Design decisions.** Short bullets that give the decision and the reason.
9. **Future work.** Only items that are still wanted.

## Reference page

The audience is someone who needs exact values, such as design tokens or an API. Lead with the principles and rules, then the tables, then the exceptions. Rules that are enforced by review rather than by tooling belong here, in imperative sentences with the reason attached.

## Task guide

The audience is someone who wants to get something done. Open with one sentence that says what the guide delivers and what it assumes.

1. **Prerequisites.** Tools and versions, with the source of the version.
2. **Setup or procedure.** Numbered steps with the exact commands in code blocks.
3. **Reference tables.** Commands, fields or settings, with defaults.
4. **Verification.** How to confirm that it worked, with the expected result.
5. **Common tasks or variations.** Short numbered recipes.
6. **Troubleshooting.** A table with the symptom in the first column and the cause and fix in the second.

## Content authoring guide

Start with the layout of the content folder and the meaning of the folder name. Give one section for each content type with a field table (field, type, required, notes), one complete example and the rules that the build enforces. End with what fails the build, so that an author can map an error message to its cause.

## README

It serves a first-time visitor. Put a logo and title first, then a one-paragraph description. After that comes the background, which tells why the project exists in plain words that the owner supplied, followed by the shortest route to running it, a map of the code, an index of the documentation and a note on agent tooling. Do not add a license section when no license file exists.

## CLAUDE.md or AGENTS.md

It is loaded into every agent session, so it stays short and imperative. It holds a one-paragraph summary, the commands, a "where to find things" table that points into `docs/`, the hard rules that agents tend to break, the skills that exist, and the instruction to keep documentation current. Everything explanatory lives in `docs/`. Remove rules that the tooling already enforces and duplicates of prose elsewhere.

## Agent skill

A skill is documentation for a repeatable task. `SKILL.md` has frontmatter with a name and a description that says when to use it, then a numbered workflow, then a checklist. Long reference material goes in `references/`, scripts in `scripts/` and starting files in `assets/`. Link to the project docs for facts instead of copying them, so the skill stays correct when the docs change.
