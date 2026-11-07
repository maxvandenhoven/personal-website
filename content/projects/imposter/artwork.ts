import { defineArtwork } from "@/lib/riso/artwork";
import { circle, roundedRect } from "@/lib/riso/geometry";
import { clamp, ease, hash } from "@/lib/riso/math";
import type { InkKey } from "@/lib/riso/painter";
import type { Motif } from "@/lib/riso/motifs/types";

interface ImposterOptions {
  players: number;
  speed: number;
}

const SEAT_COLORS: readonly InkKey[] = ["orange", "steel", "rose", "sun"];
/** Seconds per clue, voting and reveal phases (before applying the speed). */
const CLUE_TIME = 0.55;
const VOTE_TIME = 2.4;
const REVEAL_TIME = 1.4;

/** easeOutBack overshoot, so the imposter's disc pops into place. */
function pop(progress: number): number {
  const q = progress - 1;
  return 1 + 2.70158 * q * q * q + 1.70158 * q * q;
}

/**
 * imposter: seats around a table take turns giving clues, then cast votes as
 * lines across the table, and the imposter is revealed.
 */
function imposter({ players: N, speed }: ImposterOptions): Motif {
  return (P, W, H, t) => {
    P.background("ink");
    const cx = W / 2;
    const cy = H / 2;
    const rx = W * 0.36;
    const ry = H * 0.34;
    const r = Math.min(W, H) * 0.075;
    const clues = N * CLUE_TIME;
    const cycle = clues + VOTE_TIME + REVEAL_TIME + 1;
    const s = t * speed;
    const epoch = Math.floor(s / cycle);
    const phase = s % cycle;
    const imp = Math.floor(hash(epoch, 5, 11) * N);
    const seat = (i: number) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
      return [cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry] as const;
    };

    // The table: each clue adds a line to the card in the middle.
    const tw = W * 0.3;
    const th = H * 0.36;
    const tx = cx - tw / 2;
    const ty = cy - th / 2;
    P.fill(roundedRect(tx, ty, tw, th, r * 0.45), "dim");
    const lineHeight = (th * 0.78) / N;
    for (let i = 0; i < N; i++) {
      const progress = clamp((phase - i * CLUE_TIME) / (CLUE_TIME * 0.8), 0, 1);
      if (progress <= 0) break;
      const width = tw * 0.8 * (0.45 + 0.5 * hash(i, epoch, 3)) * progress;
      P.fill(
        roundedRect(
          tx + tw * 0.1,
          ty + th * 0.11 + i * lineHeight + lineHeight * 0.2,
          width,
          lineHeight * 0.6,
          lineHeight * 0.3,
        ),
        SEAT_COLORS[i % 4],
        { alpha: i === imp && phase > clues + VOTE_TIME ? 1 : 0.85 },
      );
    }

    // Votes: chords from each voter to their suspect.
    const voting = phase - clues;
    const reveal = clamp((phase - clues - VOTE_TIME) / 0.8, 0, 1);
    if (voting > 0) {
      for (let i = 0; i < N; i++) {
        let target =
          hash(i, epoch, 21) < 0.7 ? imp : Math.floor(hash(i, epoch, 23) * N);
        if (target === i)
          target = (i + 1 + Math.floor(hash(i, epoch, 27) * (N - 1))) % N;
        if (target === i) target = (i + 1) % N;
        const e = ease(
          clamp((voting - i * ((VOTE_TIME * 0.55) / N)) / 0.6, 0, 1),
        );
        if (e <= 0) continue;
        const [ax, ay] = seat(i);
        const [bx, by] = seat(target);
        const d = Math.hypot(bx - ax, by - ay);
        const ux = (bx - ax) / d;
        const uy = (by - ay) / d;
        const sx = ax + ux * r * 1.15;
        const sy = ay + uy * r * 1.15;
        const ex = bx - ux * r * 1.35;
        const ey = by - uy * r * 1.35;
        const px = sx + (ex - sx) * e;
        const py = sy + (ey - sy) * e;
        const caught = reveal > 0 && target === imp;
        P.stroke(
          (ctx) => {
            ctx.moveTo(sx, sy);
            ctx.lineTo(px, py);
          },
          caught ? "red" : "slate",
          Math.max(1, r * 0.1),
          "round",
        );
        P.fill(circle(px, py, r * 0.16), caught ? "red" : "cream");
      }
    }

    // Seats; the speaker sends out a ring, and at the end the imposter is revealed.
    for (let i = 0; i < N; i++) {
      const [x, y] = seat(i);
      const speaking = (phase - i * CLUE_TIME) / CLUE_TIME;
      if (speaking > 0 && speaking < 1.4) {
        P.stroke(
          circle(x, y, r * (1.15 + 0.6 * speaking)),
          "cream",
          Math.max(1, r * 0.08),
          "round",
          {
            alpha: clamp(1 - speaking / 1.4, 0, 1),
          },
        );
      }
      P.fill(circle(x, y, r), "cream");
      P.fill(circle(x, y, r * 0.42), SEAT_COLORS[i % 4]);
      if (i === imp && reveal > 0) {
        P.fill(circle(x, y, r * clamp(pop(reveal), 0, 1.12)), "red");
      }
    }
  };
}

export default defineArtwork({
  create: () => imposter({ players: 7, speed: 1 }),
  startTime: 1,
});
