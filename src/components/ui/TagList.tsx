import { cx } from "../../lib/cx";
import { Tag } from "./Tag";

interface TagListProps {
  tags: readonly string[];
  className?: string;
}

export function TagList({ tags, className }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className={cx("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </div>
  );
}
