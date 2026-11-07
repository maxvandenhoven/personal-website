import type { PostSummary } from "../../lib/content";
import { Card } from "../ui/Card";

interface BlogCardProps {
  post: PostSummary;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card
      href={post.href}
      external={post.external}
      artwork={post.artwork}
      artworkAlt={post.artworkAlt}
      title={post.title}
      description={post.description}
      tags={post.tags}
      meta={`${post.dateLabel} · ${post.readingTime}`}
      action={post.linkLabel}
    />
  );
}
