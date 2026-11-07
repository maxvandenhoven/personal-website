import { defineArtwork } from "@/lib/riso/artwork";
import { circle, roundedRect } from "@/lib/riso/geometry";
import type { InkKey } from "@/lib/riso/painter";
import type { Motif } from "@/lib/riso/motifs/types";

const LAYER_COLORS: readonly InkKey[] = ["navy", "slate", "steel"];

/** Infrastructure: three layers with a packet passing down through them. */
const glyph: Motif = (P, W, _H, t) => {
  P.background("ink");
  const m = W * 0.16;
  const g = W - 2 * m;
  const h = g / 3;
  LAYER_COLORS.forEach((color, i) =>
    P.fill(roundedRect(m, m + i * h + h * 0.12, g, h * 0.76, h * 0.3), color),
  );
  const y = m + ((t * 0.45) % 1) * g;
  const x = m + g * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.7)));
  P.fill(circle(x, y, h * 0.2), "cream");
};

export default defineArtwork({ create: () => glyph });
