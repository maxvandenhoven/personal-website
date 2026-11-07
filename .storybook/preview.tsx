import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect, useRef, type ReactNode } from "react";
import "../src/styles/global.css";
import { initControllers } from "../src/scripts/controllers";

/** Runs the page's client controllers inside each story, so figures animate and controls work. */
function ControllerHost({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initControllers(ref.current) : undefined));
  return <div ref={ref}>{children}</div>;
}

const withControllers: Decorator = (Story) => (
  <ControllerHost>
    <Story />
  </ControllerHost>
);

const preview: Preview = {
  decorators: [withControllers],
  parameters: {
    layout: "padded",
    backgrounds: {
      options: { paper: { name: "Paper", value: "var(--color-paper)" } },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "paper" },
  },
};

export default preview;
