import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleSkills } from "../fixtures";
import { SkillCategory } from "./SkillCategory";

const meta = {
  title: "Home/SkillCategory",
  component: SkillCategory,
  tags: ["autodocs"],
  args: { skill: sampleSkills[2] },
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
