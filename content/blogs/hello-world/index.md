---
title: Hello World
description: A draft that exercises every Markdown element the article template supports, for checking the layout while developing.
reading_time: 3 min read
tags:
  - Meta
  - Web development
draft: true
publish_date: "2026-08-01"
artwork_alt: Markdown files are built block by block into a static page, and then only a few islands on the page come alive
---

This draft is a test page for the article template. Paragraphs use the body font at a comfortable measure, with **bold text**, _emphasis_, ~~strikethrough~~, `inline code`, and [links to other sites](https://astro.build) or [pages on this site](/projects).

## Headings and lists

Second-level headings start a new section. Lists hold their own:

- An unordered list item
- Another item, with `inline code` inside it
  - A nested item
  - And another one
- A last item that is long enough to wrap onto a second line, so the hanging indent can be checked

1. Ordered lists number their items
2. Using the accent colour for the markers
3. And keep the same spacing

### A third-level heading

- [x] Task lists render checkboxes
- [ ] Unchecked items too

#### A fourth-level heading

> Block quotes set off quoted material with a rule in the accent colour. They can span several lines and still read comfortably.

A horizontal rule separates loosely related parts:

---

## Code

Code blocks are highlighted with the site's own colours:

```python
from dataclasses import dataclass


@dataclass
class Forecast:
    """A point forecast with an interval."""

    mean: float
    lower: float
    upper: float

    def width(self) -> float:
        return self.upper - self.lower  # widens with the horizon


def greet(name: str) -> str:
    return f"Hello, {name}!"
```

```ts
interface Artwork {
  create: () => Motif;
  startTime?: number;
}

export const defineArtwork = (artwork: Artwork): Artwork => artwork;
```

```sh
# Long lines scroll horizontally instead of breaking the layout
docker run --rm -it --network none --read-only --tmpfs /tmp -v "$PWD:/workspace" ghcr.io/example/sandboxed-agent:latest --dangerously-skip-permissions
```

## Images

A wide image fills the text column:

![A wide test image](./images/wide.jpg)

A small image keeps its natural size:

![A small test image](./images/test.png)

## Tables

| Model             |  MAE | Training time |
| ----------------- | ---: | ------------: |
| Seasonal naive    | 12.4 |            0s |
| Gradient boosting |  8.1 |           42s |
| Ensemble          |  7.6 |         3m 5s |

That's all. Footnotes are supported as well.[^1]

[^1]: They collect at the bottom of the article.
