import { startBackground } from "../lib/riso/background";
import { initControllers } from "./controllers";

/** Client entry point, loaded once per page by BaseLayout. */
initControllers();

const background = document.querySelector<HTMLCanvasElement>(
  "[data-riso-background]",
);
if (background) startBackground(background);
