import type { FigureId } from "./catalog";
import { forecast } from "./motifs/forecast";
import {
  aiAgentsGlyph,
  infrastructureGlyph,
  languagesGlyph,
  machineLearningGlyph,
} from "./motifs/glyph";
import { hive } from "./motifs/hive";
import { imposter } from "./motifs/imposter";
import { sandboxes } from "./motifs/sandboxes";
import { site } from "./motifs/site";
import { trials } from "./motifs/trials";
import type { Motif } from "./motifs/types";

interface FigureSpec {
  /** Creates a fresh motif, so per-canvas state is never shared. */
  create: () => Motif;
  /** Clock offset in seconds, so the first frame already shows something. */
  startTime?: number;
}

export const FIGURES: Record<FigureId, FigureSpec> = {
  trials: { create: () => trials({ cols: 6, rows: 4, speed: 2.2 }) },
  hive: { create: () => hive({ tiles: 13, speed: 0.9 }), startTime: 2 },
  imposter: { create: () => imposter({ players: 7, speed: 1 }), startTime: 1 },
  site: { create: () => site({ speed: 1 }) },
  sandboxes: { create: () => sandboxes({ columns: 8, openColumn: 5 }) },
  forecast: { create: () => forecast({ bars: 26, speed: 1.2 }) },
  languages: { create: () => languagesGlyph },
  "machine-learning": { create: () => machineLearningGlyph },
  "ai-agents": { create: () => aiAgentsGlyph },
  infrastructure: { create: () => infrastructureGlyph },
};
