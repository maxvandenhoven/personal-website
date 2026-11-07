import { defineArtwork } from "@/lib/riso/artwork";
import { circle, hexagon } from "@/lib/riso/geometry";
import { clamp, ease, hash } from "@/lib/riso/math";
import type { InkKey } from "@/lib/riso/painter";
import type { Motif } from "@/lib/riso/motifs/types";

interface HiveOptions {
  /** Number of tiles in a finished cluster. */
  tiles: number;
  speed: number;
}

interface Candidate {
  q: number;
  r: number;
  score: number;
}

interface Tile {
  q: number;
  r: number;
  color: InkKey;
  /** 0 is the queen; 1-3 are the other piece marks. */
  mark: number;
  markColor: InkKey;
}

interface Game {
  tiles: Tile[];
  steps: { candidates: Candidate[]; best: number }[];
  cx: number;
  cy: number;
  width: number;
  height: number;
}

const DIRECTIONS = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
] as const;

const SQRT3 = 1.732;
const MARK_COLORS: readonly InkKey[] = ["orange", "steel", "rose", "red"];

/** Grow a cluster of hexes; before each placement every open neighbour is scored and the best is played. */
function playGame(count: number, epoch: number): Game {
  const placed = [{ q: 0, r: 0 }];
  const occupied = new Set(["0,0"]);
  const steps: Game["steps"] = [];

  for (let i = 1; i < count; i++) {
    const candidates: Candidate[] = [];
    const seen = new Set<string>();
    for (const p of placed) {
      for (const [dq, dr] of DIRECTIONS) {
        const q = p.q + dq;
        const r = p.r + dr;
        const key = `${q},${r}`;
        if (occupied.has(key) || seen.has(key)) continue;
        seen.add(key);
        let neighbours = 0;
        for (const [a, b] of DIRECTIONS)
          if (occupied.has(`${q + a},${r + b}`)) neighbours++;
        candidates.push({
          q,
          r,
          score:
            0.2 +
            0.6 * hash(q + 50, r + 50, epoch * 31 + i) +
            0.12 * neighbours,
        });
      }
    }
    // Score candidates in order around the cluster, so the scan sweeps like a radar.
    const angle = (c: Candidate) =>
      Math.atan2(c.r * 1.5, (c.q + c.r / 2) * SQRT3);
    candidates.sort((a, b) => angle(a) - angle(b));
    let best = 0;
    let top = 0;
    candidates.forEach((c, j) => {
      if (c.score > candidates[best].score) best = j;
      top = Math.max(top, c.score);
    });
    for (const c of candidates) c.score /= top;
    placed.push({ q: candidates[best].q, r: candidates[best].r });
    occupied.add(`${candidates[best].q},${candidates[best].r}`);
    steps.push({ candidates, best });
  }

  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const p of placed) {
    const px = SQRT3 * (p.q + p.r / 2);
    const py = 1.5 * p.r;
    x0 = Math.min(x0, px);
    x1 = Math.max(x1, px);
    y0 = Math.min(y0, py);
    y1 = Math.max(y1, py);
  }

  const tiles = placed.map(({ q, r }, i): Tile => ({
    q,
    r,
    color: i % 2 ? "slate" : "cream",
    mark: i === 0 ? 0 : 1 + Math.floor(hash(i, epoch, 5) * 3),
    markColor: i === 0 ? "red" : MARK_COLORS[Math.floor(hash(i, epoch, 9) * 4)],
  }));

  return {
    tiles,
    steps,
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2,
    width: x1 - x0,
    height: y1 - y0,
  };
}

/** hive: hexagonal tiles form a cluster as possible placements are scored and one is selected. */
function hive({ tiles: N, speed }: HiveOptions): Motif {
  let cachedEpoch = Number.NaN;
  let game: Game | null = null;

  return (P, W, H, t) => {
    P.background("ink");
    const cycle = N + 1.5;
    const s = t * speed;
    const epoch = Math.floor(s / cycle);
    const phase = s % cycle;
    if (!game || cachedEpoch !== epoch) {
      cachedEpoch = epoch;
      game = playGame(N, epoch);
    }
    const g = game;

    const size = Math.min(
      (W * 0.86) / (g.width + 2 * SQRT3 * 1.6),
      (H * 0.86) / (g.height + 2 * 1.5 * 1.6),
      H * 0.16,
    );
    const at = (q: number, r: number) =>
      [
        W / 2 + size * (SQRT3 * (q + r / 2) - g.cx),
        H / 2 + size * (1.5 * r - g.cy),
      ] as const;
    const fadeOut = ease(clamp((phase - (cycle - 0.5)) / 0.5, 0, 1));
    const step = Math.floor(phase);
    const f = phase - step;
    const lineWidth = Math.max(1, size * 0.035);

    // Search: outline every open position, then score them one by one with a disc.
    if (step < N - 1 && fadeOut === 0) {
      const { candidates, best } = g.steps[step];
      const scan = clamp(f / 0.6, 0, 1) * candidates.length;
      const placing = f > 0.68;
      candidates.forEach((c, j) => {
        const [x, y] = at(c.q, c.r);
        if (j === Math.floor(scan) && !placing)
          P.fill(hexagon(x, y, size * 0.9), "dim");
        P.stroke(hexagon(x, y, size * 0.9), "slate", lineWidth);
        if (j < scan) {
          P.fill(
            circle(x, y, size * 0.32 * Math.sqrt(c.score)),
            placing && j === best ? "orange" : "steel",
            { alpha: placing && j !== best ? 0.45 : 1 },
          );
        }
      });
    }

    // Placed pieces, with a mark per piece type; the first piece is the queen.
    g.tiles.forEach((tile, i) => {
      let grow: number;
      if (i === 0) grow = ease(clamp(phase / 0.3, 0, 1));
      else if (i - 1 < step) grow = 1;
      else if (i - 1 === step) grow = ease(clamp((f - 0.7) / 0.3, 0, 1));
      else return;
      grow *= 1 - fadeOut;
      if (grow < 0.02) return;

      const [x, y] = at(tile.q, tile.r);
      const R = size * 0.92 * grow;
      P.fill(hexagon(x, y, R), tile.color);
      const mr = R * 0.32;
      if (tile.mark <= 1) {
        P.fill(circle(x, y, mr), tile.markColor);
      } else if (tile.mark === 2) {
        P.fill((ctx) => {
          ctx.moveTo(x, y - mr * 1.2);
          ctx.lineTo(x + mr * 1.1, y + mr * 0.8);
          ctx.lineTo(x - mr * 1.1, y + mr * 0.8);
          ctx.closePath();
        }, tile.markColor);
      } else {
        P.stroke(circle(x, y, mr), tile.markColor, Math.max(1, R * 0.12));
      }
    });
  };
}

export default defineArtwork({
  create: () => hive({ tiles: 13, speed: 0.9 }),
  startTime: 2,
});
