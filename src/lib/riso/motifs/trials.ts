import { figurePadding, roundedRect } from "../geometry";
import { clamp, ease, hash } from "../math";
import { drawEclipse } from "./eclipse";
import type { Motif } from "./types";

export interface TrialsOptions {
  cols: number;
  rows: number;
  speed: number;
}

/**
 * skill-evals: rows of discs that light up or stay eclipsed as an evaluation
 * sweep passes, with the skill on the left and without it on the right.
 */
export function trials({ cols: C, rows: R, speed }: TrialsOptions): Motif {
  return (P, W, H, t) => {
    P.background("ink");
    const pad = figurePadding(W, H);
    const c = Math.min((W - 2 * pad) / (2 * C + 1), (H - 2 * pad) / (R + 0.5));
    const x0 = (W - (2 * C + 1) * c) / 2;
    const y0 = (H - R * c) / 2;
    const r = c * 0.4;
    const len = 2 * C + 3;
    const s = t * speed;
    const epoch = Math.floor(s / len);
    const sweep = s % len;
    const colX = (k: number) => x0 + (k + (k >= C ? 1 : 0) + 0.5) * c;

    // The sweep bar, and the divider between the two halves.
    const sk = clamp(sweep - 0.5, 0, 2 * C - 1);
    const kf = Math.floor(sk);
    const sx =
      colX(kf) + (colX(Math.min(kf + 1, 2 * C - 1)) - colX(kf)) * (sk - kf);
    P.fill(
      roundedRect(sx - c * 0.5, y0 - c * 0.25, c, R * c + c * 0.5, c * 0.5),
      "dim",
    );
    P.fill(
      roundedRect(x0 + C * c + c * 0.46, y0, c * 0.08, R * c, c * 0.04),
      "slate",
    );

    for (let row = 0; row < R; row++) {
      for (let k = 0; k < 2 * C; k++) {
        const passRate = (k < C ? 0.84 : 0.34) - row * 0.05;
        const passes = (e: number) => hash(row * 97 + k, e, 17) < passRate;
        const offset = (ok: boolean) => (ok ? 2.1 * r : 0.3 * r);
        const progress = ease(clamp(sweep - k, 0, 1));
        const from = offset(passes(epoch - 1));
        const to = offset(passes(epoch));
        drawEclipse(
          P,
          colX(k),
          y0 + (row + 0.5) * c,
          r,
          from + (to - from) * progress,
        );
      }
    }
  };
}
