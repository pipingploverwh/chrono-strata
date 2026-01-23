import { useEffect, useCallback } from "react";

interface ShortcutConfig {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const metaMatch = shortcut.metaKey ? event.metaKey || event.ctrlKey : true;
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : true;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

        if (keyMatch && metaMatch && ctrlMatch && shiftMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
