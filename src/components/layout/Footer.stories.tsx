import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleSocials } from "../fixtures";
import { Footer } from "./Footer";

const meta = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    name: "Max van den Hoven",
    email: "max.hoven@gmail.com",
    socials: sampleSocials,
    contact: {
      title: "Get in touch",
      description:
        "If you're working on something similar or would like to discuss a project or a talk, I'd enjoy hearing from you.",
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
