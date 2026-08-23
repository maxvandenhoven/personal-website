import type { Meta, StoryObj } from "@storybook/react-vite";
import { Polaroid } from "./Polaroid";

// Simple inline placeholder photo so stories don't depend on network images.
const placeholder = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
     <rect width='300' height='300' fill='#b9c6cf'/>
     <circle cx='150' cy='115' r='55' fill='#8fa1ad'/>
     <ellipse cx='150' cy='265' rx='95' ry='75' fill='#8fa1ad'/>
   </svg>`,
)}`;

const meta = {
  title: "Notebook/Polaroid",
  component: Polaroid,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: "3rem", background: "var(--nb-hero-bg)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Polaroid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: placeholder,
    alt: "Placeholder headshot",
    signature: "Max van den Hoven",
  },
};

export const CustomPinAndTilt: Story = {
  args: {
    src: placeholder,
    alt: "Placeholder headshot",
    signature: "Tilted the other way",
    pinColor: "#2f6fb5",
    tilt: "3deg",
    size: 240,
  },
};

export const NoSignature: Story = {
  args: {
    src: placeholder,
    alt: "Placeholder headshot",
    size: 200,
  },
};
