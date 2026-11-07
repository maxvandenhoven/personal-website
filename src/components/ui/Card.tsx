import { Arrow } from "./Arrow";
import { RisoFigure } from "./RisoFigure";
import { TagList } from "./TagList";

export interface CardProps {
  href: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** Figure ID of the artwork, e.g. "projects/hive". */
  artwork: string;
  /** Description of the artwork for screen readers. */
  artworkAlt: string;
  title: string;
  /** Set the title in the monospace font, for repository-style names. */
  monospaceTitle?: boolean;
  description: string;
  tags: readonly string[];
  /** Left side of the footer, e.g. a project status or a date. */
  meta: string;
  /** Call to action on the right of the footer, e.g. "View on GitHub". */
  action: string;
}

/**
 * Linked card with a risograph figure, used for projects and articles. Exposes
 * its tags as `data-tags` so listing pages can filter it.
 */
export function Card({
  href,
  external = false,
  artwork,
  artworkAlt,
  title,
  monospaceTitle = false,
  description,
  tags,
  meta,
  action,
}: CardProps) {
  return (
    <a
      href={href}
      data-tags={JSON.stringify(tags)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group rounded-card border-rule bg-card px-frame pt-frame pb-inset hover:border-ink hover:shadow-lift flex flex-col gap-5 border transition-[border-color,transform,box-shadow] duration-250 hover:-translate-y-[3px]"
    >
      <RisoFigure
        figure={artwork}
        label={artworkAlt}
        className="rounded-art aspect-video w-full"
      />
      <div className="px-card-text flex flex-1 flex-col gap-3">
        <h3
          className={
            monospaceTitle
              ? "tracking-code font-mono text-2xl font-medium"
              : "text-3xl"
          }
        >
          {title}
        </h3>
        <p className="text-md leading-copy text-muted">{description}</p>
        <TagList tags={tags} className="mt-1 mb-2" />
        <div className="border-rule leading-label text-muted text-2xs mt-auto flex flex-wrap justify-between gap-3 border-t pt-4 font-mono">
          <span>{meta}</span>
          <span>
            {action} <Arrow className="group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
