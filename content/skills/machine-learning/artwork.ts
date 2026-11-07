import { defineArtwork } from "@/lib/riso/artwork";
import { roundedRect } from "@/lib/riso/geometry";
import type { Motif } from "@/lib/riso/motifs/types";

/** Machine learning: a short series where the last bar is the forecast. */
const glyph: Motif = (P, W, _H, t) => {
  P.background("ink");
  const m = W * 0.16;
  const g = W - 2 * m;
  const n = 4;
  const c = g / n;
  for (let i = 0; i < n; i++) {
    const h = g * (0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.3 + i * 1.1)));
    P.fill(
      roundedRect(m + i * c + c * 0.14, m + g - h, c * 0.72, h, c * 0.36),
      i === n - 1 ? "slate" : "orange",
    );
  }
};

export default defineArtwork({ create: () => glyph });
