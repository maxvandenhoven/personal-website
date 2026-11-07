import type { Meta, StoryObj } from "@storybook/react-vite";
import { sampleSocials } from "../fixtures";
import { SocialButtons } from "./SocialButtons";

const meta = {
  title: "UI/SocialButtons",
  component: SocialButtons,
  tags: ["autodocs"],
  args: { socials: sampleSocials },
} satisfies Meta<typeof SocialButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
