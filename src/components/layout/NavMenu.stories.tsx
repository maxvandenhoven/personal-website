import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavMenu } from "./NavMenu";

const meta = {
  title: "Layout/NavMenu",
  component: NavMenu,
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: "inline-radio",
      options: ["home", "projects", "blog"],
    },
  },
  args: { currentPage: "projects" },
  decorators: [
    (Story) => (
      <div className="flex min-h-64 justify-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
