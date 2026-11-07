import type { Meta, StoryObj } from "@storybook/react-vite";
import { GLYPHS, ILLUSTRATIONS } from "../../lib/riso/catalog";
import { RisoFigure } from "./RisoFigure";

const meta = {
  title: "UI/RisoFigure",
  component: RisoFigure,
  tags: ["autodocs"],
  argTypes: {
    figure: { control: "select", options: [...ILLUSTRATIONS, ...GLYPHS] },
  },
  args: {
    figure: "trials",
    label: "Rows of discs that light up as an evaluation sweep passes",
    className: "rounded-art aspect-video w-[480px]",
  },
} satisfies Meta<typeof RisoFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Illustration: Story = {};

export const Glyph: Story = {
  args: {
    figure: "languages",
    label: undefined,
    className: "rounded-chip size-10",
  },
};

export const AllIllustrations: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {ILLUSTRATIONS.map((figure) => (
        <RisoFigure
          key={figure}
          figure={figure}
          label={figure}
          className="rounded-art aspect-video w-full"
        />
      ))}
    </div>
  ),
};

export const AllGlyphs: Story = {
  render: () => (
    <div className="flex gap-3">
      {GLYPHS.map((figure) => (
        <RisoFigure
          key={figure}
          figure={figure}
          className="rounded-chip size-10"
        />
      ))}
    </div>
  ),
};
