import type { Meta, StoryObj } from "@storybook/react-vite";
import { GLYPHS } from "../../lib/riso/catalog";
import { SkillCategory } from "./SkillCategory";

const meta = {
  title: "Home/SkillCategory",
  component: SkillCategory,
  tags: ["autodocs"],
  argTypes: { glyph: { control: "select", options: GLYPHS } },
  args: {
    title: "AI agents",
    glyph: "ai-agents",
    items: [
      "Claude Code",
      "Codex",
      "Google ADK",
      "Evaluation",
      "Sandboxing",
      "Search",
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SkillCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
