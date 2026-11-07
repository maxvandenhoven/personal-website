import type { Painter } from "../painter";

/** Draws one frame of a figure at `time` seconds onto a canvas of the given device-pixel size. */
export type Motif = (
  painter: Painter,
  width: number,
  height: number,
  time: number,
) => void;
