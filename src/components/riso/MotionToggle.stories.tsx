import type { Meta, StoryObj } from "@storybook/react-vite";
import { RisoFigure } from "../ui/RisoFigure";
import { MotionToggle } from "./MotionToggle";

const meta = {
  title: "Riso/MotionToggle",
  component: MotionToggle,
  tags: ["autodocs"],
} satisfies Meta<typeof MotionToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFigure: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      <MotionToggle />
      <RisoFigure
        figure="hive"
        label="Hive"
        className="rounded-art aspect-video w-80"
      />
    </div>
  ),
};
