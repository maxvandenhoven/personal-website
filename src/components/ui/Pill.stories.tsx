import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pill } from "./Pill";

const meta = {
  title: "Notebook/Pill",
  component: Pill,
  tags: ["autodocs"],
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "typescript" },
};

export const CustomColors: Story = {
  args: {
    label: "rust",
    bg: "rgba(181,70,47,0.12)",
    color: "var(--nb-accent)",
  },
};

export const Row: Story = {
  args: { label: "react" },
  render: () => (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      <Pill label="agents" />
      <Pill label="sandboxing" />
      <Pill label="webdev" />
      <Pill label="meta" />
    </div>
  ),
};
