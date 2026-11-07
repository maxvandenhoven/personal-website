import { defineArtwork } from "@/lib/riso/artwork";
import { clamp, ease, hash } from "@/lib/riso/math";
import { drawEclipse } from "@/lib/riso/motifs/eclipse";
import type { Motif } from "@/lib/riso/motifs/types";

/** AI agents: four runs that pass or fail. */
const glyph: Motif = (P, W, _H, t) => {
  P.background("ink");
  const m = W * 0.16;
  const c = (W - 2 * m) / 2;
  const r = c * 0.38;
  for (let i = 0; i < 4; i++) {
    const x = m + ((i % 2) + 0.5) * c;
    const y = m + (Math.floor(i / 2) + 0.5) * c;
    const st = t * 0.7 + i * 0.37;
    const epoch = Math.floor(st);
    const f = ease(clamp((st - epoch) * 2.5, 0, 1));
    const offset = (e: number) => (hash(i, e, 13) < 0.65 ? 2.1 * r : 0.3 * r);
    drawEclipse(
      P,
      x,
      y,
      r,
      offset(epoch - 1) + (offset(epoch) - offset(epoch - 1)) * f,
    );
  }
};

export default defineArtwork({ create: () => glyph });
