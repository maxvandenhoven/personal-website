import { Arrow } from "../ui/Arrow";
import { Eyebrow } from "../ui/Eyebrow";
import { Pill } from "../ui/Pill";

interface SectionHeadingProps {
  /** Numbered label, e.g. "02 / Projects". */
  index: string;
  title: string;
  /** Id of the heading, for the section's aria-labelledby. */
  id: string;
  /** Optional "see all" link on the right. */
  action?: { href: string; label: string };
}

export function SectionHeading({
  index,
  title,
  id,
  action,
}: SectionHeadingProps) {
  return (
    <div className="border-rule flex flex-wrap items-end justify-between gap-4 border-t pt-6">
      <div className="flex flex-col gap-3">
        <Eyebrow>{index}</Eyebrow>
        <h2 id={id} className="leading-display text-4xl sm:text-6xl">
          {title}
        </h2>
      </div>
      {action && (
        <Pill href={action.href}>
          {action.label} <Arrow className="group-hover:translate-x-1" />
        </Pill>
      )}
    </div>
  );
}
