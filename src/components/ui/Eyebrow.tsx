import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

interface EyebrowProps {
  children: ReactNode;
  /** Overrides the accent colour, e.g. on the dark footer. */
  className?: string;
}

/** Small uppercase label above a heading, such as "02 / Projects". */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cx(
        "tracking-eyebrow font-mono text-xs leading-none font-medium uppercase",
        className ?? "text-accent",
      )}
    >
      {children}
    </span>
  );
}
