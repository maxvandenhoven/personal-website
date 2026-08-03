import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./Tag";

const meta = {
  title: "UI/Tag",
  component: Tag,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "webdev" },
};

export const Medium: Story = {
  args: { label: "typescript", size: "md" },
};

export const MultipleTags: Story = {
  args: { label: "react" },
  render: () => (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      <Tag label="Design" />
      <Tag label="Frontend" />
      <Tag label="Trends" />
      <Tag label="Typography" />
      <Tag label="Motion" />
    </div>
  ),
};
