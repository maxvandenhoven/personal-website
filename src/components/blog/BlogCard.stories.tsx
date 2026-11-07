import type { Meta, StoryObj } from "@storybook/react-vite";
import { samplePost } from "../fixtures";
import { BlogCard } from "./BlogCard";

const meta = {
  title: "Blog/BlogCard",
  component: BlogCard,
  tags: ["autodocs"],
  args: { post: samplePost },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const External: Story = {};

export const LocalArticle: Story = {
  args: {
    post: {
      ...samplePost,
      href: "/blog/hello-world",
      external: false,
      linkLabel: "Read article",
      dateLabel: "1 Aug 2026",
    },
  },
};
