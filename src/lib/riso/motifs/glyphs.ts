import type { Glyph } from "../catalog";
import { circle, roundedRect } from "../geometry";
import { clamp, ease, hash } from "../math";
import type { InkKey } from "../painter";
import { drawEclipse } from "./eclipse";
import type { Motif } from "./types";

const TILE_COLORS: readonly InkKey[] = ["cream", "steel", "slate", "orange"];
const LAYER_COLORS: readonly InkKey[] = ["navy", "slate", "steel"];

/** Languages: a cursor walks a 3x3 grid and retypes each tile. */
const languagesGlyph: Motif = (P, W, _H, t) => {
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

/** Machine learning: a short series where the last bar is the forecast. */
const machineLearningGlyph: Motif = (P, W, _H, t) => {
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

/** AI agents: four runs that pass or fail. */
const aiAgentsGlyph: Motif = (P, W, _H, t) => {
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

/** Infrastructure: three layers with a packet passing down through them. */
const infrastructureGlyph: Motif = (P, W, _H, t) => {
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

export const GLYPH_MOTIFS: Record<Glyph, Motif> = {
  languages: languagesGlyph,
  "machine-learning": machineLearningGlyph,
  "ai-agents": aiAgentsGlyph,
  infrastructure: infrastructureGlyph,
};
