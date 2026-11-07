import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "./SectionHeading";

const meta = {
  title: "Layout/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  args: { id: "heading", index: "01 / About", title: "A bit about me" },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    index: "02 / Projects",
    title: "Projects and experiments",
    action: { href: "#", label: "All projects" },
  },
};
