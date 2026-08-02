import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blogs"))
    .filter((post) => post.data.status === "published")
    .sort(
      (a, b) =>
        new Date(b.data.publish_date).getTime() -
        new Date(a.data.publish_date).getTime(),
    );

  return rss({
    title: "Max van den Hoven",
    description: "Blog posts by Max van den Hoven",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publish_date),
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
