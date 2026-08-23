import { useState, useMemo } from "react";
import { TapedBlogCard } from "./TapedBlogCard";

/**
 * BlogList — the interactive blog listing: tag filter, date sorter, and the
 * grid of taped cards.
 *
 * Rendered as a client island inside the blog listing's PaperSheet, so the
 * notebook theme (fonts, pill colors, card styling) comes straight from
 * src/styles/notebook.css. Filtering is AND-based (a post must carry every
 * selected tag); the tape rotation cycles per card so the pin-board feel
 * survives re-sorting.
 */

interface PostData {
  title: string;
  description: string;
  publishDate: string;
  readingTime: string;
  tags: string[];
  slug: string;
  bannerSrc?: string;
}

export interface BlogListProps {
  posts: PostData[];
}

/* Same cycle as the homepage cards, so the two grids feel alike. */
const tapeTilts = ["-3deg", "2deg", "-1.5deg"];

export function BlogList({ posts }: BlogListProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return [...tags].sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const result = posts.filter(
      (p) =>
        selectedTags.size === 0 ||
        [...selectedTags].every((t) => p.tags.includes(t)),
    );
    return [...result].sort((a, b) => {
      const cmp = a.publishDate.localeCompare(b.publishDate);
      return sortOrder === "newest" ? -cmp : cmp;
    });
  }, [posts, selectedTags, sortOrder]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clearAll() {
    setSelectedTags(new Set());
    setSortOrder("newest");
  }

  return (
    <>
      <div className="mb-[var(--nb-rule)] flex flex-wrap items-center gap-3">
        <span className="nb-mono-label">Filter</span>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`nb-filter-btn ${
                selectedTags.has(tag) ? "nb-filter-btn--active" : ""
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          className="nb-select"
          aria-label="Sort posts"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button type="button" onClick={clearAll} className="nb-textlink">
          Clear
        </button>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, i) => (
            <TapedBlogCard
              key={post.slug}
              title={post.title}
              description={post.description}
              publishDate={post.publishDate}
              readingTime={post.readingTime}
              tags={post.tags}
              href={`/blog/${post.slug}`}
              bannerSrc={post.bannerSrc}
              tapeTilt={tapeTilts[i % tapeTilts.length]}
            />
          ))}
        </div>
      ) : (
        <div className="nb-body py-20 text-center">
          No posts match these filters.{" "}
          <button type="button" onClick={clearAll} className="nb-textlink">
            Clear all
          </button>
        </div>
      )}
    </>
  );
}
