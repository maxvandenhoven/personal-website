import { cx } from "../../lib/cx";

interface ArrowProps {
  /** Typically a `group-hover:translate-x-*` class so the arrow nudges on hover. */
  className?: string;
}

/** Decorative arrow after a call to action. */
export function Arrow({ className }: ArrowProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-block transition-transform duration-250",
        className,
      )}
    >
      →
    </span>
  );
}
