import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogPosts, getSiteConfig } from "../lib/content";

export async function GET(context: APIContext) {
  const site = await getSiteConfig();
  const posts = await getBlogPosts();

  return rss({
    title: site.name,
    description: site.blog_page.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publish_date),
      description: post.data.description,
      categories: post.data.tags,
      link: post.data.external?.url ?? `/blog/${post.id}/`,
    })),
  });
}
