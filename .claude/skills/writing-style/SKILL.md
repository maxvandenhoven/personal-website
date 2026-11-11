---
name: writing-style
description: Write and edit in Max van den Hoven's preferred voice across website copy, blogs, READMEs, bios, and talk proposals.
---

# Max's writing style

Use this skill whenever planning, drafting, reviewing, shortening, or editing prose for Max van den Hoven in this repository. It consolidates the writing-related Hermes memories, the `humanizer` and `blog-writing` skills, their editorial references, and explicit corrections from earlier sessions. It is self-contained and does not require Hermes or access to its skills or memory.

Apply the relevant sections rather than forcing every format into the same template. Current instructions and explicit corrections take precedence over these defaults. Confirmed preferences take precedence over sample-based inferences. A publication's explicit requirements can override formatting defaults, but do not silently turn a one-off requirement into a permanent preference.

## Confirmed voice preferences

- Use US spelling in authored prose. Preserve verbatim quotations, source titles, identifiers, URLs, and code.
- Avoid em dashes. Avoid colons and semicolons unless necessary. These preferences do not require breaking code, frontmatter, URLs, technical literals, or historical quotations.
- Prefer plain language, concrete claims, and coherent reasoning over polished promotional copy.
- Write flowing, naturally connected paragraphs with varied, moderate sentence lengths. Connect related ideas through cause, consequence, contrast, qualification, and continuity. Make pronouns and references to earlier ideas unambiguous.
- Avoid staccato assertions, slogan-like fragments, rhetorical-question sequences, and strings of terse imperatives. When shortening, remove repetition and secondary detail rather than stripping connective structure. Do not compensate with run-on sentences or decorative transition words.
- A somewhat personal voice is welcome when grounded and unforced. Use supported motivations, decisions, mistakes, and observations. Avoid manufactured drama, forced intimacy, performative vulnerability, exaggerated excitement, forced jokes, self-praise, and inspirational life lessons.
- Use first person where it adds genuine perspective, without repeatedly opening sentences with “I.” Do not make the writing impersonal just to avoid that repetition. Listing introductions and speaker bios have different perspective rules below.
- Use straightforward descriptive headings and sentence-case titles unless the destination requires otherwise. Avoid generic engineering slogans and titles that merely stack framework names.
- Explain unfamiliar games, domains, and workflows before implementation details, failures, or lessons. Naming an activity is not enough to establish its mechanics.
- Connect lessons to the motivating problem rather than collecting disconnected best practices. Explain why a recommendation helps and where it stops helping.
- Keep terminology stable. Prefer simple verbs such as is, has, and does when accurate.
- Give honest editorial judgments. Do not flatter, reflexively agree, or make a description vague merely to avoid revealing its substance.
- Never invent experiences, personality traits, emotions, anecdotes, credentials, quotations, numbers, or outcomes to make writing sound human.

## Establish context before writing

Read the brief, supplied notes, current draft, inline comments, relevant content files, and existing approved wording before choosing an angle. When several versions exist, read them together and prefer explicit corrections over conflicting older claims. Do not preserve precise results or first-person experiences merely because an old draft contains them.

Establish the intended audience, purpose, destination, motivating question, reader takeaway, scope, and available evidence. Use supplied context first and ask only when missing information would materially change the result. Do not turn routine editing into a questionnaire.

Distinguish line editing from restructuring. If asked only to polish wording, preserve the argument and flag serious structural issues separately. If asked to improve the whole piece, repair the argument before polishing sentences. Preserve approved wording, unrelated fields, technical literals, examples, and qualifications unless the requested scope includes changing them.

For an explicit storyline, turn its requirements into internal acceptance criteria, including the purpose of the opening paragraphs, section order, required figures, and closing scope. Keep this scaffolding internal unless the user requests an outline or editorial discussion.

## Personal context for positioning

The following is remembered context, not a requirement to repeat a biography everywhere. Recheck time-sensitive details before publication.

Max is an AI/ML Engineer at Xebia and co-organizer of Eindhoven Data Community. His background is in Econometrics and Operations Research, with a preference for tangible physical-system problems over finance. His first master's thesis deepened his interest in ML and AI, leading to a second master's in Data Science and AI at TU/e. His experience spans ML, infrastructure, multi-agent systems, IoT, vision, and document intelligence.

Emphasize applying engineering to ML and AI, real-world impact, knowledge sharing, building in the open, and enjoyable side projects that strengthen skills for daily work. High engineering standards coexist with pragmatic delivery under time, cost, and practical constraints. A simple solution can be ideal without novel technology or a complex architecture. Education is supporting context, not mandatory hero positioning. Do not reduce his professional identity to the subject of one recent article.

Personal interests can be included when relevant and supported. Running and completing a first marathon in 2026 are remembered details, not mandatory branding. Do not invent dates, institutions, degree details, achievements, or motivations to fill a narrative gap. For new biographies, prefer the latest user-supplied profile and bio over this snapshot.

## Website copy

Treat wording requests as copy-only work unless design changes are explicitly requested. Preserve layout, classes, CSS, colors, animation behavior, rendering logic, assets, and unrelated links. An editorial request is not permission to redesign or migrate the site.

In this repository, site-wide and homepage copy live in `content/site.yaml` and `content/homepage.yaml`. Project and blog entries live under `content/projects/` and `content/blogs/`. Read the current schemas and files before editing. Follow `CLAUDE.md` and the content documentation rather than assuming every copy surface is in those files.

- Keep project and blog listing introductions to one concise, connected sentence by default, without first-person narration. Describe the projects or articles directly rather than what Max builds, shares, or learns. Do not repeat the About section.
- Let project and article cards describe their subjects directly. Avoid forced personal branding or unsupported personality claims.
- Cover the full requested editorial surface, including headings, labels, calls to action, footer text, empty states, accessibility descriptions, metadata, and script-generated text where relevant. Leave ordinary labels alone when they already work.
- Verify implemented behavior against source and feasible workflows. A roadmap is not a working feature, repository visibility is not development status, and not every project should be labeled open source for consistency.
- Verify publication dates and reading times at the publisher. Keep publication and update dates distinct. Preserve supported metadata when new verification is unavailable rather than inserting a plausible replacement.
- Use a small, consistent topic vocabulary across projects and articles. Separate topics from implementation technologies. Keep GitHub discovery topics distinct from website browsing tags.
- Reuse descriptions and tags wherever the same item appears. When tags change, update visible badges and machine-readable filter data together. Do not change link destinations incidentally.
- When shortening About without losing information, distinguish reducing density from deleting content. Only when visual changes are authorized, chronological background may move into a compact responsive study or career path while motivations and transitions survive. Keep engineering philosophy, side projects, community involvement, and personal interests in readable prose.

Verify repeated copy and tags programmatically when possible. Exercise affected filters and check responsive layouts if changes can affect them. Do not claim a prototype was checked merely because a different framework surface builds.

## Blogs and technical articles

Default to an experienced practitioner explaining a technical decision to a technically literate colleague. Assume neither universal beginner knowledge nor universal expertise. Audience depth, humor, citation style, and playful headings remain adjustable per brief.

For a normal blog, default to 1,200 to approximately 3,300 words unless requested otherwise. This range does not apply to cards, bios, abstracts, or READMEs. Let substance determine length, do not pad to reach a target, and flag topics better served by a shorter article.

### Build the argument

Create a compact internal brief covering the reader's situation, central question, supported answer, practical importance, scope, evidence gaps, and intended change in understanding or action.

Choose a structure suited to the material, such as a project narrative, tutorial, comparison, connected lessons article, or incident-to-mechanism analysis. Do not force everything into numbered tips, a fixed section count, or a security-style ladder.

For each section, identify its purpose, prerequisites, supporting example or evidence, and contribution to the central answer. Order sections by reader dependencies or an explicit practical workflow rather than the order notes were collected. For a cycle-based tutorial, introduce the cycle before walking through its steps.

Check that the title and opening promise only what the body delivers, definitions precede dependent claims, each section advances the answer, removable material is cut or merged, and the ending resolves the opening question. If sections can move freely, determine whether the piece is legitimately a collection of lessons or lacks a narrative connection. Do not manufacture causal links between independent lessons.

### Opening, body, and ending

Open with a concrete problem, supported observation, attributable incident, or authentic motivating question. Establish stakes and scope early. A direct opening is better than a manufactured hook. Do not require an autobiographical introduction, incident, question, or roadmap in every article.

Within sections, connect the relevant problem to its mechanism, response, and practical consequences. Include useful examples and limitations without repeating a rigid paragraph template. Explain why a recommendation helps before naming tools. Distinguish causes, symptoms, mechanisms, and mitigations where relevant. Define consequential distinctions once and preserve their meanings.

Connect technical choices to relevant effects such as reliability, evaluation credibility, maintenance, reproducibility, operational cost, or risk. Put trade-offs near the recommendation. A useful default is not a guarantee. Name products only when they clarify a mechanism, illustrate an option, or support reproducibility.

Use prose for reasoning, bullets for parallel items, numbered steps for ordered procedures, and tables for comparisons with meaningful shared dimensions. Include code and diagrams when they do explanatory work. Blogs can use all these formats, unlike short public abstracts.

End by answering the motivating question and stating the practical implication or next action. Synthesize rather than repeating every heading. Do not add a major new claim, generic optimism, a sales pitch, or an unapproved follow-up promise.

## READMEs and project backgrounds

Describe the concrete exploration or reason for building the project, using supported personal motivation without repeatedly opening with “I.” Avoid turning a side project into an aphorism or a grand engineering principle.

Max rejected “social deduction makes model behavior visible.” The preferred direction was to explain that Imposter explores how AI agents play the game while providing a setting to experiment with deterministic workflows, tracing, and other agent-design choices. This is a calibration example, not wording to paste into unrelated projects or evidence that every workflow succeeds.

Harmonize reading order rather than imposing identical headings. Explain the subject before implementation, followed where appropriate by background, the shortest useful getting-started route, consequential design decisions, examples, limitations, development guidance, and actual license terms. Preserve substantive examples, prerequisites, costs, trust boundaries, and qualifications. Move long deployment or API details into linked documentation without hiding essential information.

Use restrained functional badges, unnumbered headings, left-aligned explanatory prose, and a single visible project title. The established visual convention is an icon-only logo above that title, but writing work alone does not authorize replacing assets or redesigning them. Do not add a missing license without authorization.

Before applying a harmonization proposal, recover the complete approved wording and inspect current descriptions, topics, READMEs, and source. Keep proposals distinct from approved changes. Check stale feature and roadmap claims against source and feasible workflows. Preserve historical example results as historical, and distinguish implementation presence, fixture checks, and successful end-to-end execution. Do not publish metadata, commits, or PRs without authorization.

## Talk proposals, abstracts, and speaker bios

Recover the motivating curiosity, connected lessons, real examples, intended audience, and actual demo plan before drafting. The user's latest supplied revision is the source of truth for that edit.

- For short public abstracts, prefer one coherent paragraph without internal headings, lists, or blank lines. Introduce the premise and curiosity, concrete difficulties, topics, and attendee benefit. Explain enough to make the subject inviting without listing every conclusion. Do not make it vague to avoid spoilers.
- Explain unfamiliar games through who knows what, what participants do, and what they are trying to achieve before discussing engineering failures. A domain label alone is insufficient.
- Put detailed solution sequences in the detailed-description field when the form provides one. When expanding an approved abstract, preserve its voice and use numbered descriptive sections where appropriate, each connecting an observed problem, engineering response, and demonstration or evaluation. Make the progression explicit.
- Tailor technical depth without replacing the narrative with jargon. Mixed audiences need concrete failures, transferable decisions, and practical takeaways. Developer audiences can use actual libraries, code-level choices, validation, observability, and tests after the accessible opening. A game experiment is not evidence of enterprise production performance.
- Write speaker bios in third person, generally as one connected paragraph. Connect background, breadth of experience, engineering interests, and knowledge sharing. Do not derive credentials from project notes or force a fuller requested bio into an excessively short format. When asked for general qualities, avoid repeating the featured project.
- Describe participation using the actual demo plan. Preserve the difference between committed and optional elements, including narration, voices, or personas. Reconcile older descriptions when the plan changes rather than promising incompatible formats.
- If explicitly asked to assume supporting work will be finished by the talk, describe the intended delivery scope without repeated planned-versus-completed caveats. Use prospective presentation promises without inventing completed experiments or measured outcomes.
- When asked to match a conference's style, inspect real published abstracts from the requested editions first. Borrow structure and explanatory depth, not distinctive wording. Selection does not establish popularity or prove why reviewers accepted a talk. Present research findings before silently rewriting approved copy.

Read the actual CFP form and its help text to establish field names, required values, limits, and counting conventions. A CFP summary or public API may omit fields. Do not submit a form or create a remote draft merely to inspect it without authorization.

Deliver requested textual fields in chat even when saving them. Keep counts, editorial notes, research citations, recommended choices, and submission status outside paste-ready values. Use tools to count exact strings, including spaces, line breaks, and Markdown where relevant. Keep canonical fields, Markdown copies, and calculated counts synchronized when revising.

When recording a submitted version, preserve the supplied wording verbatim, including apparent typos, and flag suspected errors separately. Retain the original sent snapshot when updating a corrected current copy. Distinguish prepared, submitted, acknowledged, accepted, correction requested, and correction confirmed. Local edits or a user's email to organizers do not prove the external record changed.

## Evidence and technical integrity

Separate user-supplied experience, external facts, illustrative examples, proposals, historical results, and newly verified execution. Never turn a hypothetical benefit into an achieved project outcome. First-person claims require support from Max's material.

Verify specific external claims and current technical recommendations using appropriate primary sources. Published samples establish voice, not the continuing truth of every claim. Preserve meaningful qualifiers and weaken or remove unsupported claims. For security, distinguish execution isolation, network reach, secret visibility, and permitted actions rather than calling something safe because one control exists.

For research-heavy writing, maintain a private claim-to-source map and place attribution close to supported claims using the destination's style. Keep research notes outside paste-ready prose when possible, but do not hide uncertainty that changes meaning. Ask for essential missing evidence, omit the unsupported detail, or explicitly label a draft placeholder.

Verify code and workflows in the relevant environment when feasible and authorized. Never describe unexecuted examples as tested. Do not incur paid calls, deploy, or perform destructive checks merely to improve a description without approval.

## Editing patterns to audit

Treat these as diagnostics, not mechanical bans or an authorship detector. Do not introduce mistakes to make text seem human.

- Replace inflated significance, notability padding, promotional adjectives, and vague authority with concrete supported effects and identifiable sources.
- Remove stock openings about rapidly evolving industries, generic challenges-and-opportunities sections, and upbeat endings that add no actual implication.
- Check clichés such as delve, pivotal, tapestry, landscape, underscore, game-changer, moving forward, and deep dive. Prefer the ordinary word that states the meaning.
- Cut decorative clauses about highlighting, fostering, or symbolizing when they add no information. Retain genuine causal explanations.
- Avoid repeated “not just X but Y” formulas, artificial groups of three, meaningless “from X to Y” ranges, synonym cycling, and clipped no-guessing endings.
- Prefer explicit actors when passive voice obscures responsibility. Preserve useful passive constructions when the actor is irrelevant.
- Remove authority poses such as “at its core” and “the real question is” when they only introduce an ordinary point. Begin with substance instead of announcing an overview or repeating the heading.
- Use metaphors only when they simplify the mechanism. Do not add a metaphor that immediately needs translation back into plain language.
- State the answer directly instead of asking and immediately answering an empty rhetorical question. Preserve authentic motivating questions.
- Check repeated opener tics such as so, look, importantly, interestingly, and I think. Keep natural conversational phrasing rather than removing it mechanically.
- Avoid decorative emojis, mechanical bolding, repeated bold-label-and-colon lists, dramatic fragments, and slogan-like paragraph endings.
- Remove greetings, offers of further help, assistant commentary, generic model disclaimers, servile agreement, and unasked-for reassurance from public artifacts.
- Cut filler and stacked hedges without deleting qualifications that affect meaning. Simplify awkward compound modifiers while retaining standard technical hyphens and correct grammar.

## Review and deliver

Review in separate passes rather than polishing disconnected sentences first.

1. Reverse-outline the actual draft. Check its central question, section dependencies, progression, repeated explanations, missing premises, causal claims, and closure. For project stories, connect motivation, attempted approach, observed difficulty, response, and supported outcome.
2. Check terminology, actors, assumptions, scope, examples, numbers, timelines, pronoun referents, code/prose agreement, and the strength of recommendations across sections. Ensure the title, introduction, body, and ending make the same promise.
3. Apply the voice and editing-pattern checks. Audit repetition across sections. Preserve useful technical language and genuine personality. Read shortened passages for continuity rather than assuming fewer words mean better writing.
4. Verify facts, links, requested constraints, exact counts, and punctuation outside technical literals and quotations. When matching another article's length, measure actual body text with the same convention, excluding publisher navigation and boilerplate. A reading-time label is not a word count.
5. Inspect the scoped diff and run relevant repository checks. Do not auto-format unrelated files or claim broader verification than actually performed. For copy-only work, verify styling and behavior remain unchanged.

If delegating an editorial pass, provide the full relevant voice rules, storyline, preservation requirements, source, and exact output target. Inspect the resulting draft before accepting it. Compare source and revision with the same word-count convention when tightening is requested. If the revision grows, judge whether the additions are justified rather than calling it shorter.

Deliver the requested artifact or edited fields, not merely an audit. Apply requested file edits rather than only proposing replacement text. Keep the final change report short, including real verification and material unresolved gaps. Do not replay the research or internal editing process, and do not publish externally without authorization.

## Calibration evidence and provenance

This consolidation draws on Hermes `humanizer` 2.6.0, its writing-patterns, website-copy, conference-proposals, and repository-harmonization references, `blog-writing` 1.0.0 and its voice-evidence reference, the writing-related user memories, and earlier explicit style corrections. It includes editorial guidance, not unrelated logo-generation, deployment, scheduling, or multi-repository publishing procedures. The original Hermes skills and memories remain unchanged.

The published calibration samples recorded by the source skills are “7 Practical Tips for Demand Forecasting: Experimentation and Modeling” and “The Risks of Unprotected Agents and How to Mitigate Them,” both on the Xebia blog. They were read when the source skill was created, not freshly rechecked for this export.

The forecasting sample supports practical reasoning, concrete examples, and recommendations qualified by business context and maintenance cost. The agent-protection sample supports establishing a problem before comparing controls, distinguishing similar concepts, and acknowledging limitations and operational trade-offs. These are editorial inferences, not requirements that every piece use the same structure.

The source skill records the agent article at 3,325 whitespace-separated body words including headings and excluding publisher boilerplate. That historical measurement informs the approximate 3,300-word upper default, not an exact target. Do not infer numbered titles, a fixed section count, incident openers, long introductions, follow-up teasers, mandatory personal narration, or audience expertise from those samples. Current punctuation preferences supersede publisher title styling.

Earlier explicit corrections confirm that prose should flow through connected ideas without excessive sentence length, that personal writing should not feel forced, that US spelling is preferred, and that project and blog listing introductions should not use first person. One README-revision request also preferred Claude Sonnet 5.5 with medium thought via Claude Code over that session's draft. Treat this as a context-specific tooling preference, not a dependency of this skill or a universal model requirement.

## Attribution and license notice

The humanizer material was adapted from Siqi Chen's `blader/humanizer` under the MIT license and informed by Wikipedia's Signs of AI writing guide. Its patterns are editing heuristics, not evidence of authorship. The following notice is retained for the adapted material.

MIT License

Copyright (c) 2025 Siqi Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
