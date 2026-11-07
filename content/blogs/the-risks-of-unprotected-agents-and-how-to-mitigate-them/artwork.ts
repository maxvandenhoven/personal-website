import { defineArtwork } from "@/lib/riso/artwork";
import { circle, figurePadding, roundedRect } from "@/lib/riso/geometry";
import { hash } from "@/lib/riso/math";
import type { InkKey } from "@/lib/riso/painter";
import type { Motif } from "@/lib/riso/motifs/types";

interface SandboxesOptions {
  columns: number;
  /** Index of the column left unguarded. */
  openColumn: number;
}

const AGENT_COLORS: readonly InkKey[] = ["cream", "orange", "steel"];

/** Unprotected agents: agents moving inside rounded sandboxes, with one unguarded lane where agents wander out. */
function sandboxes({ columns: n, openColumn }: SandboxesOptions): Motif {
  return (P, W, H, t) => {
    P.background("ink");
    const pad = figurePadding(W, H);
    const c0 = (W - 2 * pad) / n;
    const rows = Math.max(1, Math.floor((H - 2 * pad) / c0));
    const c = Math.min(c0, (H - 2 * pad) / rows);
    // The outer edge of the grid sits .13c inside the padded area; only the gaps shrink.
    const inset = c * 0.13;
    const gap = c * 0.08;
    const spanX = n * c - 2 * inset;
    const spanY = rows * c - 2 * inset;
    const w = Math.min(
      (spanX - (n - 1) * gap) / n,
      (spanY - (rows - 1) * gap) / rows,
    );
    const x0 = (W - (n * w + (n - 1) * gap)) / 2;
    const y0 = (H - (rows * w + (rows - 1) * gap)) / 2;
    const agentR = c * 0.07;

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < n; i++) {
        const x = x0 + i * (w + gap);
        const y = y0 + j * (w + gap);
        if (i === openColumn) {
          P.stroke(
            roundedRect(x, y, w, w, w * 0.22),
            "slate",
            Math.max(1, c * 0.015),
          );
          continue;
        }
        P.fill(roundedRect(x, y, w, w, w * 0.22), "navy");
        for (let a = 0; a < 3; a++) {
          const reach = w / 2 - agentR - c * 0.04;
          const phase = hash(i, j, a) * 6.28;
          P.fill(
            circle(
              x + w / 2 + Math.sin(t * (0.6 + a * 0.23) + phase) * reach,
              y + w / 2 + Math.cos(t * (0.47 + a * 0.31) + phase * 1.7) * reach,
              agentR,
            ),
            AGENT_COLORS[a],
          );
        }
      }
    }

    // Agents in the open lane drift down and wander out of it.
    const span = rows * w + (rows - 1) * gap;
    for (let a = 0; a < 5; a++) {
      const phase = hash(a, 3, 5);
      const y =
        y0 +
        agentR +
        (((t * 0.08 + phase) * (span - 2 * agentR)) % (span - 2 * agentR));
      const x =
        x0 +
        openColumn * (w + gap) +
        w / 2 +
        Math.sin(t * 0.9 + phase * 9) * c * 0.9;
      P.fill(circle(x, y, agentR), "red");
    }
  };
}

export default defineArtwork({
  create: () => sandboxes({ columns: 8, openColumn: 5 }),
});
