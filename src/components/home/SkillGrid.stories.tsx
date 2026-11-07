import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkillGrid } from "./SkillGrid";

const meta = {
  title: "Home/SkillGrid",
  component: SkillGrid,
  tags: ["autodocs"],
  args: {
    skills: [
      {
        title: "Languages",
        glyph: "languages",
        items: ["Python", "SQL", "TypeScript"],
      },
      {
        title: "Machine learning",
        glyph: "machine-learning",
        items: ["Forecasting", "Gradient boosting", "MLflow"],
      },
      {
        title: "AI agents",
        glyph: "ai-agents",
        items: ["Claude Code", "Codex"],
      },
      {
        title: "Infrastructure",
        glyph: "infrastructure",
        items: ["Docker", "Terraform"],
      },
    ],
  },
} satisfies Meta<typeof SkillGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
