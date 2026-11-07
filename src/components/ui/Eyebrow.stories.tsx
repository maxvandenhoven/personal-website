import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "UI/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  args: { children: "02 / Projects" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnFooter: Story = {
  args: { children: "04 / Contact", className: "text-foot-accent" },
  decorators: [
    (Story) => (
      <div className="bg-foot p-6">
        <Story />
      </div>
    ),
  ],
};
