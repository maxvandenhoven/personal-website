import { Icon } from "../ui/Icon";
import { Pill } from "../ui/Pill";

interface MotionToggleProps {
  className?: string;
}

/**
 * Plays or pauses every animation on the page. Rendered in the playing state;
 * src/scripts/motion-toggle.ts keeps it in sync (it starts paused when the
 * visitor prefers reduced motion).
 */
export function MotionToggle({ className }: MotionToggleProps) {
  return (
    <Pill
      iconOnly
      data-motion-toggle=""
      aria-pressed={false}
      aria-label="Pause animations"
      title="Pause animations"
      className={className}
    >
      <Icon name="pause" size={14} className="group-aria-pressed:hidden" />
      <Icon name="play" size={14} className="hidden group-aria-pressed:block" />
    </Pill>
  );
}
