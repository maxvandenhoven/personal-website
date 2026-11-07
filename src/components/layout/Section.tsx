import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/** Page section: a vertical stack whose heading clears the sticky header when linked to. */
export function Section({ children, className, ...rest }: SectionProps) {
  return (
    <section
      {...rest}
      className={cx("flex scroll-mt-24 flex-col gap-8 sm:gap-12", className)}
    >
      {children}
    </section>
  );
}
