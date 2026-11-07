import type { Meta, StoryObj } from "@storybook/react-vite";
import { StudyPath } from "./StudyPath";

const meta = {
  title: "Home/StudyPath",
  component: StudyPath,
  tags: ["autodocs"],
  args: {
    title: "How I got here",
    steps: [
      {
        school: "Tilburg University",
        degree: "BSc. Econometrics & Operations Research",
        description: "I was drawn to Operations Research.",
      },
      {
        school: "Eindhoven University of Technology",
        degree: "MSc. Data Science & AI",
        description: "I chose a second master's to develop technical depth.",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StudyPath>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
