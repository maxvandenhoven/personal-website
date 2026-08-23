import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotebookButton } from "./NotebookButton";

const meta = {
  title: "Notebook/NotebookButton",
  component: NotebookButton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: "2rem", background: "var(--nb-hero-bg)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotebookButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { href: "#", children: "Read the blog →" },
};

export const AccentBackground: Story = {
  args: {
    href: "#",
    children: "Read the blog →",
    bg: "var(--nb-accent)",
  },
};

export const CustomColors: Story = {
  args: {
    href: "#",
    children: "Say hello",
    bg: "var(--nb-blog-margin)",
    text: "#ffffff",
  },
};
