import type { Meta, StoryObj } from "@storybook/react-vite";
import headshot from "../../../content/headshot.png";
import { sampleSocials } from "../fixtures";
import { Hero } from "./Hero";

const meta = {
  title: "Home/Hero",
  component: Hero,
  tags: ["autodocs"],
  args: {
    title: "Building ML and AI systems",
    description:
      "I'm an AI/ML Engineer at Xebia who enjoys solving practical problems with well-engineered systems.",
    socials: sampleSocials,
    portrait: {
      // Storybook's Vite imports images as URLs; Astro imports them as metadata.
      src: String(headshot),
      width: 1254,
      height: 1254,
      alt: "Portrait of Max van den Hoven",
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
