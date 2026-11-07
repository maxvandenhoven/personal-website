import { defineArtwork } from "@/lib/riso/artwork";
import { circle, figurePadding, roundedRect } from "@/lib/riso/geometry";
import { clamp, hash } from "@/lib/riso/math";
import type { Motif } from "@/lib/riso/motifs/types";

interface ForecastOptions {
  bars: number;
  speed: number;
}

/** Weekly and monthly seasonality around a base level. */
const seasonal = (k: number) =>
  0.44 +
  0.2 * Math.sin((Math.PI * 2 * k) / 7) +
  0.12 * Math.sin((Math.PI * 2 * k) / 31);

/**
 * Demand forecasting: rounded bars of past demand scrolling toward a "now" line,
 * followed by widening forecast intervals.
 */
function forecast({ bars: N, speed }: ForecastOptions): Motif {
  return (P, W, H, t) => {
    P.background("ink");
    const pad = figurePadding(W, H);
    const xa = pad;
    const xb = W - pad;
    const step = (xb - xa) / N;
    const bw = step * 0.56;
    const base = H - pad;
    const scale = (H - 2 * pad) * 0.8;
    const s = t * speed;
    const k0 = Math.floor(s);
    const fraction = s - k0;
    const nowX = xa + (xb - xa) * 0.66;

    for (let i = -1; i <= N + 1; i++) {
      const k = k0 + i;
      const x = xa + (i - fraction + 0.5) * step;
      const edge = clamp(
        Math.min(x - xa - bw / 2, xb - x - bw / 2) / step + 1,
        0,
        1,
      );
      if (edge <= 0) continue;
      if (x < nowX) {
        const v = clamp(seasonal(k) + (hash(k, 1, 5) - 0.5) * 0.18, 0.08, 0.96);
        P.fill(
          roundedRect(x - bw / 2, base - v * scale, bw, v * scale, bw / 2),
          hash(k, 2, 5) < 0.1 ? "red" : "orange",
          {
            alpha: edge,
          },
        );
      } else {
        const horizon = (x - nowX) / (xb - nowX);
        const mean = seasonal(k);
        const band = 0.05 + 0.2 * horizon;
        const low = Math.max(0, mean - band);
        P.fill(
          roundedRect(
            x - bw / 2,
            base - (mean + band) * scale,
            bw,
            (mean + band - low) * scale,
            bw / 2,
          ),
          "slate",
          {
            alpha: edge,
          },
        );
        P.fill(circle(x, base - mean * scale, bw * 0.3), "cream", {
          alpha: edge,
        });
      }
    }
    P.fill(
      roundedRect(
        nowX - step * 0.06,
        pad,
        step * 0.12,
        H - 2 * pad,
        step * 0.06,
      ),
      "rose",
    );
  };
}

export default defineArtwork({
  create: () => forecast({ bars: 26, speed: 1.2 }),
});
