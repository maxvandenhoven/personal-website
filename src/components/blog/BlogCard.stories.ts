import type { Meta, StoryObj } from "@storybook/react-vite";
import { BlogCard } from "./BlogCard";

const meta = {
  title: "Blog/BlogCard",
  component: BlogCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "beige",
      values: [
        { name: "beige", value: "#e8e4d9" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "The return of chunky, tactile UI",
    description:
      "Why neobrutalism is winning over a generation of designers tired of glass and blur.",
    publishDate: "2026-08-01",
    readingTime: "5 min",
    tags: ["Design", "Frontend", "Trends"],
    href: "/blog/hello-world",
    slug: "hello-world",
  },
};

export const GreenBanner: Story = {
  args: {
    title: "Type systems that actually work",
    description:
      "How to build a type scale that grows with your product without losing its personality.",
    publishDate: "2026-07-15",
    readingTime: "8 min",
    tags: ["Typography", "Design"],
    href: "/blog/type-systems",
    slug: "type-systems",
  },
};

export const LongTitle: Story = {
  args: {
    title:
      "An Extremely Long Blog Post Title That Tests How the Card Handles Overflow and Wrapping",
    description:
      "Stop treating animation as polish. It should be structural from day one.",
    publishDate: "2026-06-20",
    readingTime: "6 min",
    tags: ["Motion", "CSS", "Architecture", "Testing"],
    href: "/blog/long-title",
    slug: "long-title",
  },
};

export const NoTags: Story = {
  args: {
    title: "A Post Without Tags",
    description: "Short and sweet.",
    publishDate: "2026-05-01",
    readingTime: "2 min",
    tags: [],
    href: "/blog/no-tags",
    slug: "no-tags",
  },
};
