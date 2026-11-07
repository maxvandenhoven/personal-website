import type { Meta, StoryObj } from "@storybook/react-vite";
import { ARTWORK_IDS } from "../../lib/riso/registry";
import { RisoFigure } from "./RisoFigure";

const meta = {
  title: "UI/RisoFigure",
  component: RisoFigure,
  tags: ["autodocs"],
  argTypes: {
    figure: { control: "select", options: ARTWORK_IDS },
  },
  args: {
    figure: "projects/skill-evals",
    label: "Rows of discs that light up as an evaluation sweep passes",
    className: "rounded-art aspect-video w-[480px]",
  },
} satisfies Meta<typeof RisoFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Artwork: Story = {};

export const Glyph: Story = {
  args: {
    figure: "skills/languages",
    label: undefined,
    className: "rounded-chip size-10",
  },
};

/** Every content/<collection>/<slug>/artwork.ts, drafts included. */
export const AllArtworks: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {ARTWORK_IDS.map((id) => (
        <figure key={id} className="flex flex-col gap-2">
          <RisoFigure
            figure={id}
            label={id}
            className="rounded-art aspect-video w-full"
          />
          <figcaption className="text-muted text-2xs font-mono">
            {id}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const AllGlyphs: Story = {
  render: () => (
    <div className="flex gap-3">
      {ARTWORK_IDS.filter((id) => id.startsWith("skills/")).map((id) => (
        <RisoFigure key={id} figure={id} className="rounded-chip size-10" />
      ))}
    </div>
  ),
};
