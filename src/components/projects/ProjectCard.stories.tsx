import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleProject } from "../fixtures";
import { ProjectCard } from "./ProjectCard";

const meta = {
  title: "Projects/ProjectCard",
  component: ProjectCard,
  tags: ["autodocs"],
  args: { project: sampleProject },
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
