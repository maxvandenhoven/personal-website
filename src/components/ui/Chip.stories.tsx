import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./Chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "TypeScript" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {};

export const Toggle: Story = {
  args: { pressed: false },
};

export const Pressed: Story = {
  args: { pressed: true, children: "All" },
};
