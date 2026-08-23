import type { Meta, StoryObj } from "@storybook/react-vite";
import { TapedBlogCard } from "./TapedBlogCard";

// Simple inline placeholder banner so stories don't depend on network images.
const banner = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'>
     <rect width='600' height='300' fill='#dbe5e3'/>
     <path d='M0 220 L150 120 L300 190 L450 90 L600 160 L600 300 L0 300 Z' fill='#6f9a91'/>
   </svg>`,
)}`;

const meta = {
  title: "Notebook/TapedBlogCard",
  component: TapedBlogCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          padding: "3rem",
          background: "var(--nb-blog-bg)",
          maxWidth: "360px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TapedBlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Thinking on paper",
    description: "Why the messiest notebooks hold the clearest ideas.",
    readingTime: "6 min read",
    publishDate: "2026-03-14",
    tags: ["writing", "analog"],
    href: "#",
    bannerSrc: banner,
  },
};

export const Tilted: Story = {
  args: {
    ...Default.args,
    title: "The graph-paper method",
    tilt: "1.6deg",
  },
};

export const NoBanner: Story = {
  args: {
    ...Default.args,
    title: "Dog-eared for later",
    bannerSrc: undefined,
    tags: ["reading"],
  },
};
