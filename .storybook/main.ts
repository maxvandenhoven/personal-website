import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import type { AliasOptions } from "vite";

/** The tsconfig "@/*" path, which Astro resolves itself but Storybook does not. */
const srcAlias = {
  find: "@",
  replacement: fileURLToPath(new URL("../src", import.meta.url)),
};

function withSrcAlias(alias: AliasOptions | undefined): AliasOptions {
  if (Array.isArray(alias)) return [...alias, srcAlias];
  const entries = Object.entries(alias ?? {}).map(([find, replacement]) => ({
    find,
    replacement,
  }));
  return [...entries, srcAlias];
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  // Astro adds Tailwind and the "@/" alias through its own config; Storybook needs them explicitly.
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
    resolve: {
      ...viteConfig.resolve,
      alias: withSrcAlias(viteConfig.resolve?.alias),
    },
  }),
};
export default config;
