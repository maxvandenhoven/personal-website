import { circle } from "../geometry";
import type { Painter } from "../painter";

/** Direction the shadow disc travels in; shared so every eclipse lines up. */
const DIRECTION_X = 0.96;
const DIRECTION_Y = -0.28;

/**
 * A lit disc partially covered by a dark one, used as a pass/fail marker.
 * `offset` is how far the shadow has moved off the disc: 0 is fully eclipsed,
 * 2r or more is fully lit.
 */
export function drawEclipse(
  painter: Painter,
  x: number,
  y: number,
  r: number,
  offset: number,
  alpha = 1,
): void {
  painter.fill(circle(x, y, r), "ember", { alpha });
  if (offset < 2 * r) {
    painter.clipFill(
      circle(x, y, r),
      circle(x + DIRECTION_X * offset, y + DIRECTION_Y * offset, r),
      "night",
      { alpha },
    );
  }
}
