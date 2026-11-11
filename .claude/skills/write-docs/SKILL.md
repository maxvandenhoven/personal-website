---
name: write-docs
description: Audit, restructure and rewrite a repository's documentation so people and coding agents can follow it. Covers exploring the repo, proposing the file layout for approval, writing from source, verifying every claim, removing consolidated files and opening the PR. Use when asked to consolidate, reorganize, refresh or add documentation.
---

# Write docs

This skill describes how the documentation of this repository was consolidated into `README.md`, `CLAUDE.md`, `docs/architecture.md`, `docs/design-system.md` and `docs/guides/`, and how to repeat or extend that work. The result is documentation that is accurate against the source, written once, and usable by a person and by a coding agent.

The process has seven steps. The proposal in step 2 is a gate. Do not write or delete anything before the user has answered it.

Prose written for this repository follows the `writing-style` skill. Load it before step 4.

## 1. Explore

Read before you plan. The goal is a complete inventory and an honest view of what is stale.

- List every file that documents something: `README.md`, `CLAUDE.md` or `AGENTS.md`, `docs/`, `.claude/` and similar agent folders, `CONTRIBUTING.md`, workflow comments, and long comments in config files. Check `git ls-files` as well as the working tree, because untracked files are easy to miss.
- Read each of them in full, then read the source they describe. For a web project that means the manifest and scripts, the Makefile, the CI and deploy workflows, the config files, the content schemas, the entry points and the modules that hold the main logic.
- Compare claims with the source. Note every statement that no longer holds, such as a removed tool, a renamed folder, a changed trigger or an old design.
- Look for gaps, meaning behavior that the source has and no page explains. Typical examples are a second workflow, a rule that is enforced only in code, and a constraint that exists for performance reasons.
- Look for debris. Empty folders, orphaned files that nothing links to, and obsolete planning documents such as old implementation prompts all qualify.
- Check other branches (`git branch -a`) for unmerged documentation work, and the agent memory for pointers to files that are about to move.

Use `scripts/check_docs.py` on the existing docs to get a first list of broken links and missing paths.

Do the exploration yourself with Read and Bash. It needs the full context, and a delegated search returns excerpts instead of understanding.

## 2. Propose and wait

Present the plan before writing anything. The user asked for headers and one sentence per file, so keep it that short.

1. Summarize the findings in a few bullets. Name the files to consolidate, what is stale, what is missing and what is debris.
2. Propose the layout as a tree, then give each file its section headers with one sentence on what it covers. Follow the user's requested layout and add files only where a topic would overload another page or mix audiences. Mark every addition as an extra and say why it earns a page.
3. List what will be removed or slimmed down.
4. End with a short numbered list of decisions that belong to the user, such as whether to add the extras, whether to add a root README, how far to cut `CLAUDE.md` and what to do with empty folders.

Then stop and wait. Apply the answers exactly. In the original run, the user answered by adding a request (a skill for generating artworks) and an instruction for the README (include the project background). Treat such additions as part of the scope.

See `references/proposal-template.md` for the shape of the message.

## 3. Branch

Create a branch named for the work, for example `chore/docs-refresh`. Do not commit to `main`. Leave committing until the end unless the user asks otherwise.

## 4. Write from the source

Write the architecture page first, because the other pages link back to it, and `README.md` and `CLAUDE.md` last, because they are summaries of everything else.

- **Derive facts from the source, not from the old docs.** Read the schema before writing a field table, the workflow before describing a pipeline and the Makefile before listing commands. Where an old page and the source disagree, the source wins, and the correction goes in the PR description.
- **Verify outside facts.** For claims about a third party, such as how a platform handles a config file, search the official documentation. In the original run this caught a wrong statement about `CNAME` files with GitHub Pages workflows.
- **Give every topic one home.** Describe it once and link from other pages. Duplication is how the original documents drifted apart.
- **Write for both readers.** People need the reason and the order. Agents need exact paths, commands, field names, defaults and failure messages. Use prose for reasoning and design decisions, tables for fields, commands and symptoms, numbered steps for procedures and code blocks for anything copyable.
- **Explain why.** Add a short design decisions section and say why constraints exist, such as a frame rate that is capped on purpose.
- **Say what fails.** Pages that describe a schema or a pipeline end with what breaks the build and what each failure means.
- **State what does not exist.** If there is no test suite, no license or no staging environment, say so in the place a reader would look.
- **Keep one voice.** Use the same heading style, the same tense and the same terms on every page. Sentence-case headings, present tense, and one name per concept.

`references/page-patterns.md` contains skeletons for the page types that were used. `references/lessons.md` lists the project-specific traps that came up.

## 5. Verify

Check that the pages are true and that nothing broke.

1. Run `python3 .claude/skills/write-docs/scripts/check_docs.py --removed <old file>` for every file you are deleting. It must report no problems, apart from placeholder examples you can justify.
2. Run the project's formatter and its full check (`make check`, then `make ci` here). The pre-commit hook formats Markdown, so format before committing to keep tables aligned.
3. Run the build and look at the output for every claim about it, such as which files appear in `dist/`.
4. Exercise commands that a page tells the reader to run, or do not describe them as tested. Never mark an unexecuted example as verified.
5. Re-read each page against the source one more time, this time looking only for numbers, names, paths and triggers.

## 6. Remove and rewire

- Delete the consolidated and redundant files with `git rm`, and remove empty folders. Obsolete planning documents are deleted, not migrated.
- Search the repo for mentions of the removed files, and update them. This includes `CLAUDE.md`, workflow comments, source comments and the agent memory.
- Rewrite `CLAUDE.md` as an entry point. It keeps commands, hard rules, a table of where to find things and an instruction to keep the docs current, and everything else moves into `docs/`.

## 7. Deliver

- Commit in logical groups with conventional messages, for example one commit for the docs, one for each new skill and one for housekeeping. Add every new file the user asked for, and check `git status` for anything left over.
- Push the branch and open a pull request. The description has a summary, a section called corrections that lists the places where the old docs were wrong, and a test plan with the checks that actually ran.
- Report briefly. Say what was written, what was removed, what was corrected and anything the user must decide or check, such as untracked files that will not exist for other contributors.

## Keeping documentation healthy

The documentation stays accurate only when changes to behavior update the matching page in the same pull request. `CLAUDE.md` carries that instruction for agents. When a change touches a schema, a command, a workflow, a design token or the artwork API, search `docs/` for its old name before you finish, and run the checker.
