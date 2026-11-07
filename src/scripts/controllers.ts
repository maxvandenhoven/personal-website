import { mountFigures } from "../lib/riso/engine";
import { initMotionToggles } from "./motion-toggle";
import { initNavMenus } from "./nav-menu";
import { initTagFilters } from "./tag-filter";

/**
 * Attach every interactive behaviour to the server-rendered markup inside
 * `root`. Returns a function that detaches them again (used by Storybook).
 */
export function initControllers(root: ParentNode = document): () => void {
  const cleanups = [
    initTagFilters(root),
    initMotionToggles(root),
    initNavMenus(root),
    mountFigures(root),
  ];
  return () => cleanups.forEach((cleanup) => cleanup());
}
