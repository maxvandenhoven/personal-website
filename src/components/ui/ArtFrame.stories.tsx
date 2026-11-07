import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArtFrame } from "./ArtFrame";

const meta = {
  title: "UI/ArtFrame",
  component: ArtFrame,
  tags: ["autodocs"],
  args: {
    className: "rounded-art aspect-video w-80",
    children: null,
  },
} satisfies Meta<typeof ArtFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Square: Story = {
  args: { className: "rounded-art aspect-square w-48" },
};
