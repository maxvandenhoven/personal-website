import type { Meta, StoryObj } from "@storybook/react-vite";
import { collectTags } from "../../lib/tags";
import { sampleProjects } from "../fixtures";
import { ProjectCard } from "../projects/ProjectCard";
import { FilterableList } from "./FilterableList";

const meta = {
  title: "UI/FilterableList",
  component: FilterableList,
  tags: ["autodocs"],
  args: {
    label: "Browse projects",
    tags: collectTags(sampleProjects),
    total: sampleProjects.length,
    noun: { singular: "project", plural: "projects" },
    emptyMessage: "No projects match this topic.",
    children: sampleProjects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    )),
  },
} satisfies Meta<typeof FilterableList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
