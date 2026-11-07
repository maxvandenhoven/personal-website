import type { ReactNode } from "react";
import { cx } from "../../lib/cx";

interface ArtFrameProps {
  /** Size, aspect ratio and corner radius of the frame. */
  className?: string;
  children: ReactNode;
}

/** Paper-coloured frame with a hairline edge that holds a figure or photo. */
export function ArtFrame({ className, children }: ArtFrameProps) {
  return (
    <div
      className={cx(
        "bg-art outline-rule overflow-hidden outline -outline-offset-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
