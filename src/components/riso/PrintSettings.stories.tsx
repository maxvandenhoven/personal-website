import type { Meta, StoryObj } from "@storybook/react-vite";
import { RisoFigure } from "../ui/RisoFigure";
import { PrintSettings } from "./PrintSettings";

const meta = {
  title: "Riso/PrintSettings",
  component: PrintSettings,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="min-h-[720px] p-6">
      <RisoFigure
        figure="imposter"
        label="Imposter"
        className="rounded-art aspect-video w-[480px]"
      />
      <PrintSettings />
    </div>
  ),
} satisfies Meta<typeof PrintSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
