import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, type IconName } from "./Icon";

const NAMES: IconName[] = [
  "github",
  "linkedin",
  "play",
  "pause",
  "menu",
  "close",
];

const meta = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: { name: { control: "select", options: NAMES } },
  args: { name: "github", size: 22 },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const All: Story = {
  render: ({ size }) => (
    <div className="flex gap-4">
      {NAMES.map((name) => (
        <Icon key={name} name={name} size={size} />
      ))}
    </div>
  ),
};
