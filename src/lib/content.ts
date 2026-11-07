import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { formatDate } from "./format";
import type { Illustration } from "./riso/catalog";

/**
 * Build-time access to the CMS in content/. Pages use these helpers instead of
 * querying collections directly, so filtering, sorting and the shape of the data
 * passed to components live in one place.
 */

export type BlogEntry = CollectionEntry<"blogs">;

/** Everything a project card needs; plain data so it can be passed to components and stories. */
export interface ProjectSummary {
  slug: string;
  title: string;
  monospaceTitle: boolean;
  description: string;
  tags: string[];
  figure: Illustration;
  figureAlt: string;
  url: string;
  stage: string;
}

/** Everything a blog card needs. */
export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  figure: Illustration;
  figureAlt: string;
  href: string;
  /** Whether `href` points to another site. */
  external: boolean;
  /** Call to action, e.g. "Read on Xebia". */
  linkLabel: string;
  /** "31 Jul 2026", or "Updated 3 Sep 2026" for revised articles. */
  dateLabel: string;
  readingTime: string;
}

export async function getSiteConfig() {
  const entry = await getEntry("site", "config");
  if (!entry)
    throw new Error("content/site.yaml must contain an entry with id: config");
  return entry.data;
}

export async function getHomepageConfig() {
  const entry = await getEntry("homepage", "config");
  if (!entry)
    throw new Error(
      "content/homepage.yaml must contain an entry with id: config",
    );
  return entry.data;
}

/** Pick items by slug in the given order, failing the build on unknown or unpublished slugs. */
export function selectBySlug<T extends { slug: string }>(
  items: readonly T[],
  slugs: readonly string[],
  kind: string,
): T[] {
  return slugs.map((slug) => {
    const item = items.find((candidate) => candidate.slug === slug);
    if (!item)
      throw new Error(
        `Featured ${kind} "${slug}" does not exist or is not published`,
      );
    return item;
  });
}

export async function getProjects(): Promise<ProjectSummary[]> {
  const entries = await getCollection(
    "projects",
    ({ data }) => data.status === "published",
  );
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map(({ id, data }) => ({
      slug: id,
      title: data.title,
      monospaceTitle: data.monospace_title,
      description: data.description,
      tags: data.tags,
      figure: data.figure,
      figureAlt: data.figure_alt,
      url: data.github_link,
      stage: data.stage,
    }));
}

/** Date used for ordering: the last revision if there is one. */
function sortDate(post: BlogEntry): string {
  return post.data.updated_date ?? post.data.publish_date;
}

/** Whether the post has its own page on this site (it has a Markdown body). */
export function hasLocalPage(post: BlogEntry): boolean {
  return Boolean(post.body?.trim());
}

/** Published posts, most recently published or updated first. */
export async function getPublishedPosts(): Promise<BlogEntry[]> {
  const entries = await getCollection(
    "blogs",
    ({ data }) => data.status === "published",
  );
  for (const post of entries) {
    if (!post.data.external && !hasLocalPage(post)) {
      throw new Error(
        `Blog post "${post.id}" needs either a Markdown body or an external link`,
      );
    }
  }
  return entries.sort((a, b) => sortDate(b).localeCompare(sortDate(a)));
}

export function toPostSummary(post: BlogEntry): PostSummary {
  const { data } = post;
  return {
    slug: post.id,
    title: data.title,
    description: data.description,
    tags: data.tags,
    figure: data.figure,
    figureAlt: data.figure_alt,
    href: data.external?.url ?? `/blog/${post.id}`,
    external: Boolean(data.external),
    linkLabel: data.external ? `Read on ${data.external.site}` : "Read article",
    dateLabel: data.updated_date
      ? `Updated ${formatDate(data.updated_date)}`
      : formatDate(data.publish_date),
    readingTime: data.reading_time,
  };
}

export async function getPosts(): Promise<PostSummary[]> {
  return (await getPublishedPosts()).map(toPostSummary);
}
