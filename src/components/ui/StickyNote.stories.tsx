import type { Meta, StoryObj } from "@storybook/react-vite";
import { StickyNote } from "./StickyNote";

const meta = {
  title: "Notebook/StickyNote",
  component: StickyNote,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          padding: "3rem",
          background: "var(--nb-skills-bg)",
          maxWidth: "320px",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StickyNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Languages",
    items: ["Python", "TypeScript", "Rust", "Go"],
  },
};

export const Mint: Story = {
  args: {
    title: "Infrastructure",
    items: ["Docker", "PostgreSQL", "Linux"],
    bg: "var(--nb-sticky-2)",
    tilt: "1.4deg",
  },
};

export const Peach: Story = {
  args: {
    title: "Frontend",
    items: ["React", "Astro", "Tailwind CSS"],
    bg: "var(--nb-sticky-3)",
    tilt: "-0.8deg",
  },
};

export const CustomFonts: Story = {
  args: {
    title: "Handwritten",
    items: ["Caveat titles", "Serif list"],
    titleFont: "var(--nb-font-signature)",
    listFont: "var(--nb-font-body)",
  },
};
