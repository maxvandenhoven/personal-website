import { defineArtwork } from "@/lib/riso/artwork";
import { hash } from "@/lib/riso/math";
import { roundedRect } from "@/lib/riso/geometry";
import type { InkKey } from "@/lib/riso/painter";
import type { Motif } from "@/lib/riso/motifs/types";

const TILE_COLORS: readonly InkKey[] = ["cream", "steel", "slate", "orange"];

/** Languages: a cursor walks a 3x3 grid and retypes each tile. */
const glyph: Motif = (P, W, _H, t) => {
  P.background("ink");
  const m = W * 0.16;
  const c = (W - 2 * m) / 3;
  const phase = t * 1.4;
  const cursor = Math.floor(phase) % 9;
  const cycle = Math.floor(phase / 9);
  for (let i = 0; i < 9; i++) {
    const pass = cycle - (i > cursor ? 1 : 0);
    const color =
      i === cursor ? "red" : TILE_COLORS[Math.floor(hash(i, pass, 3) * 4)];
    P.fill(
      roundedRect(
        m + (i % 3) * c + c * 0.08,
        m + Math.floor(i / 3) * c + c * 0.08,
        c * 0.84,
        c * 0.84,
        c * 0.22,
      ),
      color,
    );
  }
};

export default defineArtwork({ create: () => glyph });
