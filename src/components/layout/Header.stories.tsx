import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";

const meta = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    currentPage: {
      control: "inline-radio",
      options: ["home", "projects", "blog"],
    },
  },
  args: { name: "Max van den Hoven", currentPage: "home" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoCurrentPage: Story = {
  args: { currentPage: undefined },
};
