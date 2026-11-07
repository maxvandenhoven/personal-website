import type { Meta, StoryObj } from "@storybook/react-vite";
import { AboutStory } from "./AboutStory";

const meta = {
  title: "Home/AboutStory",
  component: AboutStory,
  tags: ["autodocs"],
  args: {
    lede: "I enjoy solving problems where I can see the impact of what I build.",
    paragraphs: [
      "I care about engineering things well, but try to keep that ambition grounded in what the work needs to achieve.",
      "I enjoy helping people learn from each other as a co-organizer of the [Eindhoven Data Community](https://www.meetup.com/nl-nl/eindhoven-data-community/).",
    ],
  },
} satisfies Meta<typeof AboutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
