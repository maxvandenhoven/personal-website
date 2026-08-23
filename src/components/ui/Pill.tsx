/**
 * Pill — a small rounded skill/tag pill (used on the taped blog cards).
 *
 * Colors come from the central theme (--nb-pill-bg / --nb-pill-text in
 * src/styles/notebook.css) and can be overridden per-instance.
 *
 * Usage:
 *   <Pill label="typescript" />
 *   <Pill label="rust" bg="rgba(181,70,47,0.12)" color="var(--nb-accent)" />
 */
import type { CSSProperties } from "react";

export interface PillProps {
  label: string;
  /** Background color override (default: --nb-pill-bg). */
  bg?: string;
  /** Text color override (default: --nb-pill-text). */
  color?: string;
}

export function Pill({ label, bg, color }: PillProps) {
  const style: CSSProperties = {
    ...(bg ? { "--nb-pill-bg": bg } : {}),
    ...(color ? { "--nb-pill-text": color } : {}),
  } as CSSProperties;

  return (
    <span className="nb-pill" style={style}>
      {label}
    </span>
  );
}
