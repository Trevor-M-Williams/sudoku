import { useEffect } from "react";

interface UseKeyboardControlsProps {
  selectedValue: number | null;
  setSelectedValue: (value: number | null) => void;
  undo: () => void;
  redo: () => void;
}

export function useKeyboardControls({
  selectedValue,
  setSelectedValue,
  undo,
  redo,
}: UseKeyboardControlsProps) {
  useEffect(() => {
    const handleNumberKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const num = parseInt(e.key);
        setSelectedValue(num === selectedValue ? null : num);
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener("keydown", handleNumberKeys);
    return () => window.removeEventListener("keydown", handleNumberKeys);
  }, [selectedValue, setSelectedValue]);

  useEffect(() => {
    const handleUndoRedo = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener("keydown", handleUndoRedo);
    return () => window.removeEventListener("keydown", handleUndoRedo);
  }, [undo, redo]);
}
