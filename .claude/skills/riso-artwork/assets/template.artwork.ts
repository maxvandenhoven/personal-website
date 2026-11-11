import { defineArtwork } from "@/lib/riso/artwork";
import { figurePadding, roundedRect } from "@/lib/riso/geometry";
import { clamp, ease, hash } from "@/lib/riso/math";
import type { Motif } from "@/lib/riso/motifs/types";

interface TilesOptions {
  columns: number;
  rows: number;
  /** Epochs per second: how often the tiles pick a new state. */
  speed: number;
}

/**
 * Subject: one sentence that says what the scene shows. Copy this file to
 * content/<collection>/<slug>/artwork.ts and replace the scene. Here, tiles
 * switch between two states and a bar sweeps across them.
 */
function tiles({ columns, rows, speed }: TilesOptions): Motif {
  return (P, W, H, t) => {
    P.background("ink");

    // One cell size from the padded area, everything else is a fraction of it.
    const pad = figurePadding(W, H);
    const c = Math.min((W - 2 * pad) / columns, (H - 2 * pad) / rows);
    const x0 = (W - columns * c) / 2;
    const y0 = (H - rows * c) / 2;

    // Epochs give a loop without a visible reset: each tile eases from its
    // previous outcome to the current one.
    const s = t * speed;
    const epoch = Math.floor(s);
    const f = ease(clamp(s - epoch, 0, 1));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const scale = (e: number) => (hash(col, row, e) < 0.5 ? 1 : 0.55);
        const k = scale(epoch - 1) + (scale(epoch) - scale(epoch - 1)) * f;
        const size = c * 0.86 * k;
        P.fill(
          roundedRect(
            x0 + (col + 0.5) * c - size / 2,
            y0 + (row + 0.5) * c - size / 2,
            size,
            size,
            c * 0.2,
          ),
          "navy",
        );
      }
    }

    // One accent that marks the key moment.
    const sweepX = x0 + (((t * speed * 0.5) % 1) * (columns - 1) + 0.5) * c;
    P.fill(
      roundedRect(sweepX - c * 0.06, y0, c * 0.12, rows * c, c * 0.06),
      "red",
    );
  };
}

export default defineArtwork({
  create: () => tiles({ columns: 6, rows: 3, speed: 0.8 }),
});
