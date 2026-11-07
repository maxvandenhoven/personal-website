import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageHeading } from "./PageHeading";

const meta = {
  title: "Layout/PageHeading",
  component: PageHeading,
  tags: ["autodocs"],
  args: {
    id: "page-h",
    index: "02 / Projects",
    title: "Projects",
    lead: "These projects explore game-playing AI, agent evaluation, and web development through hands-on experiments.",
  },
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutLead: Story = {
  args: { lead: undefined },
};
