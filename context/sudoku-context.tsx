"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  generatePuzzle,
  isValidMove,
  calculateRemainingNumbers,
  checkCompletion,
} from "@/lib/sudoku";
import { SudokuCell } from "@/lib/types";
import { formatTime } from "@/lib/utils";

import { difficultyOptions } from "@/lib/constants";

import confetti from "canvas-confetti";

type GameStatus = "start" | "playing" | "complete";

interface HistoryEntry {
  board: SudokuCell[][];
  selectedValue: number | null;
}

interface HighScore {
  time: number;
  date: string;
}

interface HighScores {
  [difficulty: string]: HighScore[];
}

interface SudokuContextType {
  gameStatus: GameStatus;
  board: SudokuCell[][];
  solution: number[][];
  selectedValue: number | null;
  remainingNumbers: Record<number, number>;
  difficulty: number;
  canUndo: boolean;
  canRedo: boolean;
  elapsedTime: number;
  formattedTime: string;
  highScores: HighScores;
  undo: () => void;
  redo: () => void;
  setGameStatus: (status: GameStatus) => void;
  setSelectedValue: (value: number | null) => void;
  setDifficulty: (difficulty: number) => void;
  generateNewBoard: () => void;
  updateGame: (updatedCell: SudokuCell) => void;
}

const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

export function SudokuProvider({ children }: { children: React.ReactNode }) {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState(0.5);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [highScores, setHighScores] = useState<HighScores>({});

  useEffect(() => {
    const savedScores = localStorage.getItem("sudokuHighScores");
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // TODO move logic to lib
  function generateNewBoard() {
    const { board, solution } = generatePuzzle(difficulty);
    setSolution(solution);

    const initialBoard: SudokuCell[][] = board.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value: value === 0 ? null : value,
        isFixed: value !== 0,
        row: rowIndex,
        column: colIndex,
        notes: [],
      }))
    );
    setBoard(initialBoard);
    setHistory([{ board: initialBoard, selectedValue: null }]);
    setCurrentHistoryIndex(0);
    setElapsedTime(0);
  }

  // TODO move logic to lib
  function updateGame(updatedCell: SudokuCell) {
    // Create a deep copy of the board first
    const newBoard = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        notes: [...cell.notes],
      }))
    );

    // Update the cell
    newBoard[updatedCell.row][updatedCell.column] = {
      ...updatedCell,
      notes: [...updatedCell.notes],
    };

    // Clear notes when a value is placed
    if (updatedCell.value !== null) {
      const squareStartRow = Math.floor(updatedCell.row / 3) * 3;
      const squareStartCol = Math.floor(updatedCell.column / 3) * 3;

      newBoard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (rowIndex === updatedCell.row && colIndex === updatedCell.column)
            return;

          const isInSameRow = rowIndex === updatedCell.row;
          const isInSameCol = colIndex === updatedCell.column;
          const isInSameSquare =
            rowIndex >= squareStartRow &&
            rowIndex < squareStartRow + 3 &&
            colIndex >= squareStartCol &&
            colIndex < squareStartCol + 3;

          if (isInSameRow || isInSameCol || isInSameSquare) {
            // Create a new cell object with filtered notes
            newBoard[rowIndex][colIndex] = {
              ...cell,
              notes: cell.notes.filter((note) => note !== updatedCell.value),
            };
          }
        });
      });
    }

    setBoard(newBoard);
    saveToHistory(newBoard);

    if (updatedCell.value !== null) {
      const currentBoardNumbers = newBoard.map((row) =>
        row.map((cell) => cell.value || 0)
      );
      const isValid = isValidMove(
        currentBoardNumbers,
        updatedCell.row,
        updatedCell.column,
        updatedCell.value
      );

      if (isValid) {
        const isComplete = checkCompletion(newBoard, solution);
        if (isComplete) {
          setGameStatus("complete");
          setBoard([]);
          setSolution([]);
          setSelectedValue(null);
        }
      }
    }

    return newBoard;
  }

  const saveToHistory = useCallback(
    (newBoard: SudokuCell[][]) => {
      const newEntry: HistoryEntry = {
        board: newBoard,
        selectedValue,
      };

      const newHistory = history.slice(0, currentHistoryIndex + 1);

      setHistory([...newHistory, newEntry]);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    },
    [history, currentHistoryIndex, selectedValue]
  );

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const previousEntry = history[currentHistoryIndex - 1];
      setBoard(previousEntry.board);
      setSelectedValue(previousEntry.selectedValue);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  }, [currentHistoryIndex, history]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextEntry = history[currentHistoryIndex + 1];
      setBoard(nextEntry.board);
      setSelectedValue(nextEntry.selectedValue);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  }, [currentHistoryIndex, history]);

  useEffect(() => {
    if (gameStatus === "playing") {
      generateNewBoard();
    }
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus === "complete") {
      const screenWidth = window.innerWidth;

      confetti({
        startVelocity: screenWidth * 0.05,
        angle: 0,
        spread: 55,
        particleCount: 100,
        origin: { x: -0.2, y: 0.1 },
      });

      confetti({
        startVelocity: screenWidth * 0.05,
        angle: 180,
        spread: 55,
        particleCount: 100,
        origin: { x: 1.2, y: 0.1 },
      });

      const difficultyLabel =
        difficultyOptions.find((d) => d.value === difficulty)?.label ||
        "Unknown";
      const newScore: HighScore = {
        time: elapsedTime,
        date: new Date().toISOString(),
      };

      setHighScores((prevScores) => {
        const updatedScores = { ...prevScores };
        const difficultyScores = updatedScores[difficultyLabel] || [];

        // Add new score and sort by time (ascending)
        const newScores = [...difficultyScores, newScore]
          .sort((a, b) => a.time - b.time)
          .slice(0, 5); // Keep only top 5 scores

        updatedScores[difficultyLabel] = newScores;

        // Save to localStorage
        localStorage.setItem("sudokuHighScores", JSON.stringify(updatedScores));

        return updatedScores;
      });
    }
  }, [gameStatus]);

  useEffect(() => {
    // Meta key + number to select a number
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const num = parseInt(e.key);
        setSelectedValue(num === selectedValue ? null : num);
        (document.activeElement as HTMLElement)?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameStatus === "playing") {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStatus]);

  const remainingNumbers = calculateRemainingNumbers(board, solution);
  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  const value = {
    gameStatus,
    board,
    solution,
    selectedValue,
    remainingNumbers,
    difficulty,
    canUndo,
    canRedo,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    highScores,
    undo,
    redo,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    generateNewBoard,
    updateGame,
  };

  return (
    <SudokuContext.Provider value={value}>{children}</SudokuContext.Provider>
  );
}

export function useSudoku() {
  const context = useContext(SudokuContext);
  if (context === undefined) {
    throw new Error("useSudoku must be used within a SudokuProvider");
  }
  return context;
}
