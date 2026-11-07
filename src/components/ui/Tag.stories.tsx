import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./Tag";

const meta = {
  title: "UI/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: { label: "Evaluation" },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
