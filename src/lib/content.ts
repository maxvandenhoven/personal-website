import {
  getCollection,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { formatDate } from "./format";
import { artworkId, hasArtwork } from "./riso/registry";

/**
 * Build-time access to the CMS in content/. Pages use these helpers instead of
 * querying collections directly, so filtering, sorting, validation and the
 * shape of the data passed to components live in one place.
 */

export type BlogEntry = CollectionEntry<"blogs">;

/** Everything a project card needs; plain data so it can be passed to components and stories. */
export interface ProjectSummary {
  slug: string;
  title: string;
  monospaceTitle: boolean;
  description: string;
  tags: string[];
  /** Figure ID of the project's artwork. */
  artwork: string;
  artworkAlt: string;
  url: string;
  /** e.g. "Open source" or "In development". */
  status: string;
}

/** Everything a blog card needs. */
export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  /** Figure ID of the post's artwork. */
  artwork: string;
  artworkAlt: string;
  href: string;
  /** Whether `href` points to another site. */
  external: boolean;
  /** Call to action, e.g. "Read on Xebia" or "Read article". */
  linkLabel: string;
  /** e.g. "31 Jul 2026". */
  dateLabel: string;
  readingTime: string;
}

/** Drafts are visible while developing (`make dev`) and excluded from the build. */
function isVisible({ data }: { data: { draft: boolean } }): boolean {
  return import.meta.env.DEV || !data.draft;
}

/** Fail the build when a visible entry has no artwork.ts next to its index.md. */
function requireArtwork(collection: CollectionKey, slug: string): string {
  const id = artworkId(collection, slug);
  if (!hasArtwork(id)) {
    throw new Error(`Missing artwork: add content/${id}/artwork.ts`);
  }
  return id;
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

/** Pick items by slug in the given order, failing the build on unknown or draft slugs. */
export function selectBySlug<T extends { slug: string }>(
  items: readonly T[],
  slugs: readonly string[],
  kind: string,
): T[] {
  return slugs.map((slug) => {
    const item = items.find((candidate) => candidate.slug === slug);
    if (!item)
      throw new Error(
        `Featured ${kind} "${slug}" does not exist or is a draft`,
      );
    return item;
  });
}

export async function getProjects(): Promise<ProjectSummary[]> {
  const entries = await getCollection("projects", isVisible);
  return entries
    .sort((a, b) => a.data.order - b.data.order)
    .map(({ id, data }) => ({
      slug: id,
      title: data.title,
      monospaceTitle: data.monospace_title,
      description: data.description,
      tags: data.tags,
      artwork: requireArtwork("projects", id),
      artworkAlt: data.artwork_alt,
      url: data.github_link,
      status: data.status,
    }));
}

/** Whether the post is hosted on this site (rather than linking elsewhere). */
export function isLocalPost(post: BlogEntry): boolean {
  return !post.data.external;
}

/** Visible posts, newest first. Each is either hosted here or links elsewhere, never both. */
export async function getBlogPosts(): Promise<BlogEntry[]> {
  const entries = await getCollection("blogs", isVisible);
  for (const post of entries) {
    const hasBody = Boolean(post.body?.trim());
    if (post.data.external && hasBody) {
      throw new Error(
        `Blog post "${post.id}" links to ${post.data.external.name} but also has a Markdown body; remove one of them`,
      );
    }
    if (!post.data.external && !hasBody) {
      throw new Error(
        `Blog post "${post.id}" needs a Markdown body or an external link`,
      );
    }
  }
  return entries.sort((a, b) =>
    b.data.publish_date.localeCompare(a.data.publish_date),
  );
}

export function toPostSummary(post: BlogEntry): PostSummary {
  const { data } = post;
  return {
    slug: post.id,
    title: data.title,
    description: data.description,
    tags: data.tags,
    artwork: requireArtwork("blogs", post.id),
    artworkAlt: data.artwork_alt,
    href: data.external?.url ?? `/blog/${post.id}/`,
    external: Boolean(data.external),
    linkLabel: data.external ? `Read on ${data.external.name}` : "Read article",
    dateLabel: formatDate(data.publish_date),
    readingTime: data.reading_time,
  };
}

export async function getPosts(): Promise<PostSummary[]> {
  return (await getBlogPosts()).map(toPostSummary);
}
