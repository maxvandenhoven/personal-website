import type { Meta, StoryObj } from "@storybook/react-vite";
import { Arrow } from "./Arrow";
import { Icon } from "./Icon";
import { Pill } from "./Pill";

const meta = {
  title: "UI/Pill",
  component: Pill,
  tags: ["autodocs"],
  args: { children: "Print settings" },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {};

export const Link: Story = {
  args: {
    href: "#",
    children: (
      <>
        All projects <Arrow className="group-hover:translate-x-1" />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    "aria-label": "Pause animations",
    children: <Icon name="pause" size={14} />,
  },
};
