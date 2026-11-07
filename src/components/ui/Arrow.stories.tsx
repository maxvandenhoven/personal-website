import type { Meta, StoryObj } from "@storybook/react-vite";
import { Arrow } from "./Arrow";

const meta = {
  title: "UI/Arrow",
  component: Arrow,
  tags: ["autodocs"],
} satisfies Meta<typeof Arrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InHoverGroup: Story = {
  args: { className: "group-hover:translate-x-1.5" },
  render: (args) => (
    <a href="#" className="group font-mono text-xs">
      Hover me <Arrow {...args} />
    </a>
  ),
};
