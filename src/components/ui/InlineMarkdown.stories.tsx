import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineMarkdown } from "./InlineMarkdown";

const meta = {
  title: "UI/InlineMarkdown",
  component: InlineMarkdown,
  tags: ["autodocs"],
  args: {
    text: "I co-organize the [Eindhoven Data Community](https://www.meetup.com/nl-nl/eindhoven-data-community/) and write on the [blog](/blog).",
  },
} satisfies Meta<typeof InlineMarkdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLinks: Story = {};

export const PlainText: Story = {
  args: { text: "No links here, and <b>HTML</b> is shown as text." },
};
