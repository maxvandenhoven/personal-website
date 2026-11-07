import { mountFigures } from "../lib/riso/engine";
import { initMotionToggles } from "./motion-toggle";
import { initPrintSettings } from "./print-settings";
import { initTagFilters } from "./tag-filter";

/**
 * Attach every interactive behaviour to the server-rendered markup inside
 * `root`. Returns a function that detaches them again (used by Storybook).
 */
export function initControllers(root: ParentNode = document): () => void {
  const cleanups = [
    initTagFilters(root),
    initMotionToggles(root),
    initPrintSettings(root),
    mountFigures(root),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}
