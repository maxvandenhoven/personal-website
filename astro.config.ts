import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://maxvandenhoven.com",
  integrations: [react(), sitemap()],
  markdown: {
    // Token colours come from the --astro-code-* variables in global.css.
    shikiConfig: { theme: "css-variables" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
