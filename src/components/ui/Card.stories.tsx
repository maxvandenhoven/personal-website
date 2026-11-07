import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-[560px]">
        <Story />
      </div>
    ),
  ],
  args: {
    href: "#",
    artwork:
      "blogs/7-practical-tips-for-demand-forecasting-experimentation-and-modeling",
    artworkAlt: "Bars of past demand followed by widening forecast intervals",
    title:
      "7 practical tips for demand forecasting: experimentation and modeling",
    description:
      "Drawing on demand forecasting work in the energy sector, these seven lessons explain how validation, baselines, and reproducible experiments make model comparisons more credible.",
    tags: ["Machine learning", "Forecasting", "Evaluation"],
    meta: "Updated 3 Sep 2026 · 10 min read",
    action: "Read on Xebia",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MonospaceTitle: Story = {
  args: {
    title: "imposter",
    monospaceTitle: true,
    artwork: "projects/imposter",
    meta: "Open source",
    action: "View on GitHub",
  },
};

export const NoTags: Story = {
  args: { tags: [] },
};
