import type { ReactNode } from "react";

interface CardGridProps {
  /** Columns on wide screens; collapses to fewer on narrow ones. */
  columns?: 2 | 3;
  children: ReactNode;
}

export function CardGrid({ columns = 2, children }: CardGridProps) {
  const layout =
    columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2";
  return (
    <div className={`gap-gutter grid grid-cols-1 ${layout}`}>{children}</div>
  );
}
