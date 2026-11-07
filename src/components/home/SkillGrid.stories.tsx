import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleSkills } from "../fixtures";
import { SkillGrid } from "./SkillGrid";

const meta = {
  title: "Home/SkillGrid",
  component: SkillGrid,
  tags: ["autodocs"],
  args: { skills: sampleSkills },
} satisfies Meta<typeof SkillGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
