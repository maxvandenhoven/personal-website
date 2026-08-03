import { useState, useMemo } from "react";
import { BlogCard } from "./BlogCard";

interface PostData {
  title: string;
  description: string;
  publishDate: string;
  readingTime: string;
  tags: string[];
  slug: string;
}

interface BlogListProps {
  posts: PostData[];
}

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
      <div className="py-4">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-3 px-8">
          <span className="text-text-secondary text-[11px] font-bold tracking-wider uppercase">
            Filter
          </span>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`btn-lift cursor-pointer rounded-md border-[1.5px] border-[#000] px-3 py-1.5 text-[11px] font-bold shadow-[0_2px_0_#000] select-none ${
                  selectedTags.has(tag)
                    ? "bg-accent-500 text-[#000]"
                    : "text-text-primary bg-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
            className="text-text-primary cursor-pointer rounded-md border-2 border-[#000] bg-white px-3 py-1.5 text-[13px] font-bold shadow-sm outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button
            onClick={clearAll}
            className="text-text-primary cursor-pointer border-none bg-transparent text-[13px] font-bold underline decoration-2 underline-offset-2"
          >
            Clear
          </button>
        </div>
      </div>
      <section className="pt-6 pb-16">
        <div className="mx-auto max-w-[1100px] px-8">
          <span className="text-text-secondary mb-5 block text-[13px]">
            {filteredPosts.length} post
            {filteredPosts.length === 1 ? "" : "s"}
          </span>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  description={post.description}
                  publishDate={post.publishDate}
                  readingTime={post.readingTime}
                  tags={post.tags}
                  href={`/blog/${post.slug}`}
                  slug={post.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-text-secondary py-16 text-center">
              No posts match these filters.{" "}
              <button
                onClick={clearAll}
                className="text-text-primary cursor-pointer border-none bg-transparent font-bold underline decoration-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
