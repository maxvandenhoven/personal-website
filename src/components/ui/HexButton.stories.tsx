import type { Meta, StoryObj } from "@storybook/react-vite";
import { HexButton } from "./HexButton";

const meta = {
  title: "UI/HexButton",
  component: HexButton,
  tags: ["autodocs"],
  argTypes: {
    fill: { control: "color" },
    shadow: { control: "color" },
    sideLength: { control: { type: "range", min: 40, max: 200, step: 10 } },
    borderRadius: { control: { type: "range", min: 0, max: 30, step: 1 } },
    elevation: { control: { type: "range", min: 0, max: 30, step: 1 } },
  },
} satisfies Meta<typeof HexButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fill: "oklch(0.93 0.02 250)",
    shadow: "oklch(0.76 0.08 250)",
  },
};

export const WithText: Story = {
  args: {
    text: "Hello",
    fill: "oklch(0.86 0.04 250)",
    shadow: "oklch(0.64 0.12 250)",
  },
};

export const Accent: Story = {
  args: {
    text: "Go",
    fill: "oklch(0.85 0.12 160)",
    shadow: "oklch(0.6 0.18 160)",
  },
};

export const SharpCorners: Story = {
  args: {
    borderRadius: 0,
    text: "Sharp",
    fill: "oklch(0.93 0.02 250)",
    shadow: "oklch(0.76 0.08 250)",
  },
};

export const Large: Story = {
  args: {
    sideLength: 150,
    text: "Big",
    elevation: 18,
    fill: "oklch(0.86 0.04 250)",
    shadow: "oklch(0.64 0.12 250)",
  },
};

export const AsLink: Story = {
  args: {
    text: "Link",
    href: "https://example.com",
    fill: "oklch(0.85 0.12 160)",
    shadow: "oklch(0.6 0.18 160)",
  },
};

interface HexGridArgs {
  sideLength: number;
  borderRadius: number;
  elevation: number;
  padding: number;
  fill: string;
  shadow: string;
}

export const Grid: StoryObj<HexGridArgs> = {
  argTypes: {
    padding: { control: { type: "range", min: -20, max: 40, step: 1 } },
    sideLength: { control: { type: "range", min: 40, max: 200, step: 10 } },
    borderRadius: { control: { type: "range", min: 0, max: 30, step: 1 } },
    elevation: { control: { type: "range", min: 0, max: 30, step: 1 } },
    fill: { control: "color" },
    shadow: { control: "color" },
  },
  args: {
    sideLength: 80,
    borderRadius: 12,
    elevation: 10,
    padding: 16,
    fill: "oklch(0.93 0.02 250)",
    shadow: "oklch(0.76 0.08 250)",
  },
  render: ({ sideLength, borderRadius, elevation, padding, fill, shadow }) => {
    const w = Math.sqrt(3) * sideLength;
    const colStep = w + padding;
    const rowStep = 1.5 * sideLength + padding;
    const totalH = 2 * sideLength + elevation;

    const rows = [
      { count: 2, offsetX: colStep / 2 },
      { count: 3, offsetX: 0 },
    ];

    const labels = ["A", "B", "C", "D", "E"];
    let labelIdx = 0;

    return (
      <div
        style={{
          position: "relative",
          width: rows[1].count * colStep,
          height: rowStep + totalH,
        }}
      >
        {rows.map((row, r) =>
          Array.from({ length: row.count }, (_, c) => {
            const x = row.offsetX + c * colStep;
            const y = r * rowStep;
            const label = labels[labelIdx++];
            return (
              <div
                key={label}
                style={{ position: "absolute", left: x, top: y }}
              >
                <HexButton
                  sideLength={sideLength}
                  borderRadius={borderRadius}
                  elevation={elevation}
                  fill={fill}
                  shadow={shadow}
                  text={label}
                />
              </div>
            );
          }),
        )}
      </div>
    );
  },
};
