import type { ReactNode } from "react";
import { Eyebrow } from "../ui/Eyebrow";

interface PageHeadingProps {
  /** Numbered label, e.g. "03 / Blog". */
  index: string;
  title: string;
  /** Id of the heading, for the section's aria-labelledby. */
  id: string;
  lead?: string;
  /** Extra content below the lead, such as article metadata or a link. */
  children?: ReactNode;
}

/** The h1 block at the top of every page except the homepage. */
export function PageHeading({
  index,
  title,
  id,
  lead,
  children,
}: PageHeadingProps) {
  return (
    <section
      aria-labelledby={id}
      className="flex scroll-mt-24 flex-col gap-6 pt-8 md:pt-12"
    >
      <div className="flex flex-col gap-3">
        <Eyebrow>{index}</Eyebrow>
        <h1 id={id} className="text-display leading-display">
          {title}
        </h1>
      </div>
      {lead && (
        <p className="text-muted max-w-measure-lg leading-copy text-xl">
          {lead}
        </p>
      )}
      {children}
    </section>
  );
}
