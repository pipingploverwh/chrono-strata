import { useState, useEffect, useCallback } from "react";

/**
 * Announcement Entrance Overlay Hook
 * 
 * Template for full-screen event/announcement overlays.
 * Behavior:
 * - Appears immediately on entrance (0s delay)
 * - Shows on every visit (no session persistence)
 * - Can be manually triggered via open/toggle
 * 
 * Usage:
 *   const { isOpen, open, close, toggle } = useEventOverlay();
 *   // isOpen will be true immediately on mount
 */
export const useEventOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Show immediately on mount - no delay, no session check
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useEventOverlay;
