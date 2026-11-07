import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

const meta = {
  title: "Layout/Section",
  component: Section,
  tags: ["autodocs"],
  args: {
    "aria-labelledby": "section-h",
    children: (
      <>
        <SectionHeading id="section-h" index="03 / Blog" title="Writing" />
        <p className="text-muted">Section content goes here.</p>
      </>
    ),
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
