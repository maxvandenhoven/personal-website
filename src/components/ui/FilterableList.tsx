import type { ReactNode } from "react";
import { pluralize } from "../../lib/format";
import { Section } from "../layout/Section";
import { CardGrid } from "./CardGrid";
import { Chip } from "./Chip";

interface FilterableListProps {
  /** Accessible name of the section, e.g. "Browse projects". */
  label: string;
  /** Every tag used by the items, in display order. */
  tags: readonly string[];
  /** Number of items, shown before any filter is applied. */
  total: number;
  noun: { singular: string; plural: string };
  emptyMessage: string;
  columns?: 2 | 3;
  /** Cards exposing their tags through `data-tags` (see Card). */
  children: ReactNode;
}

/**
 * A card grid with single-select topic filters. Server-rendered with everything
 * visible; src/scripts/tag-filter.ts adds the filtering.
 */
export function FilterableList({
  label,
  tags,
  total,
  noun,
  emptyMessage,
  columns = 3,
  children,
}: FilterableListProps) {
  return (
    <Section
      aria-label={label}
      data-tag-filter=""
      data-noun-singular={noun.singular}
      data-noun-plural={noun.plural}
    >
      <div className="border-rule flex flex-wrap items-start justify-between gap-4 border-t pt-6">
        <ul
          aria-label="Filter by topic"
          className="flex min-w-[min(100%,320px)] flex-[1_1_0] flex-wrap gap-2"
        >
          <li>
            <Chip pressed data-tag="">
              All
            </Chip>
          </li>
          {tags.map((tag) => (
            <li key={tag}>
              <Chip pressed={false} data-tag={tag}>
                {tag}
              </Chip>
            </li>
          ))}
        </ul>
        <span
          data-filter-count=""
          aria-live="polite"
          className="tracking-mono text-muted pt-3 font-mono text-xs leading-none font-medium whitespace-nowrap"
        >
          {pluralize(total, noun.singular, noun.plural)}
        </span>
      </div>
      <CardGrid columns={columns}>{children}</CardGrid>
      <p
        data-filter-empty=""
        hidden
        className="rounded-card border-rule text-muted px-inset border border-dashed py-12 text-center"
      >
        {emptyMessage}
      </p>
    </Section>
  );
}
