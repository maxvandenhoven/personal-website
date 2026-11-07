import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleProjects } from "../fixtures";
import { ProjectCard } from "../projects/ProjectCard";
import { CardGrid } from "./CardGrid";

const meta = {
  title: "UI/CardGrid",
  component: CardGrid,
  tags: ["autodocs"],
  args: {
    children: sampleProjects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    )),
  },
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {};

export const ThreeColumns: Story = {
  args: { columns: 3 },
};
