# Proposal template

Send this as the message that ends step 2, and keep it compact. The user reads it as a decision document, not as the documentation itself.

````markdown
I've explored the repo and haven't changed anything yet.

## What I found

- **Files to consolidate:** <every file whose content moves>
- **Stale material:** <specific claims that no longer match the source, with the file and what changed>
- **Gaps:** <behavior that the source has and no page explains>
- **Debris:** <empty folders, orphaned or obsolete files, unmerged documentation branches>

## Proposed layout

```
docs/
  architecture.md
  <extra>.md                   (extra)
  guides/
    <guide>.md
```

### `architecture.md`

One sentence on the purpose and the reader.

- **<Section>.** What it covers in one line.
- **<Section>.** What it covers in one line.

### `<extra>.md` (extra)

One sentence that says why this deserves its own page.

- **<Section>.** What it covers.

(repeat for every file)

## Files to remove or change

- **Remove:** <files>, with the reason for each.
- **Slim down:** <files>, and what they keep.

## Questions

1. <Decision that belongs to the user, with a recommendation>
2. <...>
````

Guidelines for the message.

- Keep each section to a header and one line. The headers carry the plan.
- Describe extras separately and justify them. Typical reasons are that a topic would double the length of another page, that two audiences need different pages, or that a reference is repeated in several places.
- Recommend an answer for every question, so the user can approve with one word.
- Do not ask about things that have a conventional default. Pick it and mention it.
- Do not create the branch, write files or delete files before the user replies.
