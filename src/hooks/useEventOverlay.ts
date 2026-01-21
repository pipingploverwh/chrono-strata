import { useState, useEffect, useCallback } from "react";

const SESSION_KEY = "strata_event_dismissed";

export const useEventOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoShown, setHasAutoShown] = useState(false);

  // Check if we should auto-show (once per session)
  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (!dismissed && !hasAutoShown) {
      // Delay auto-show for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoShown(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [hasAutoShown]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        sessionStorage.setItem(SESSION_KEY, "true");
      }
      return !prev;
    });
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export default useEventOverlay;
