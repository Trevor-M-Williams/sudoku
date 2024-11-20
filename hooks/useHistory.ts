import { useState, useCallback } from "react";
import { SudokuCell } from "@/lib/types";

interface HistoryEntry {
  board: SudokuCell[][];
  selectedValue: number | null;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const saveToHistory = useCallback(
    (board: SudokuCell[][], selectedValue: number | null) => {
      const newEntry: HistoryEntry = {
        board,
        selectedValue,
      };

      const newHistory = history.slice(0, currentHistoryIndex + 1);

      setHistory([...newHistory, newEntry]);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    },
    [history, currentHistoryIndex]
  );

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const previousEntry = history[currentHistoryIndex - 1];
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      return previousEntry;
    }
    return null;
  }, [currentHistoryIndex, history]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextEntry = history[currentHistoryIndex + 1];
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      return nextEntry;
    }
    return null;
  }, [currentHistoryIndex, history]);

  const initializeHistory = useCallback((initialBoard: SudokuCell[][]) => {
    setHistory([{ board: initialBoard, selectedValue: null }]);
    setCurrentHistoryIndex(0);
  }, []);

  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  return {
    saveToHistory,
    undo,
    redo,
    initializeHistory,
    canUndo,
    canRedo,
  };
}
