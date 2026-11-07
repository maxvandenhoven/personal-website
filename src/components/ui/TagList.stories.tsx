import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagList } from "./TagList";

const meta = {
  title: "UI/TagList",
  component: TagList,
  tags: ["autodocs"],
  args: { tags: ["AI agents", "Sandboxing", "Security"] },
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { tags: [] },
};
