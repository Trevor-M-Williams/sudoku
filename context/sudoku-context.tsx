"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useGameState } from "@/hooks/useGameState";
import { useHistory } from "@/hooks/useHistory";
import { useSavedGame } from "@/hooks/useSavedGame";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { calculateRemainingNumbers } from "@/lib/sudoku";
import { formatTime } from "@/lib/utils";
import {
  SudokuCell,
  Difficulty,
  GameStatus,
  HighScore,
  HighScores,
  SavedGameState,
} from "@/lib/types";
import confetti from "canvas-confetti";

interface SudokuContextType {
  gameStatus: GameStatus;
  board: SudokuCell[][];
  solution: number[][];
  selectedValue: number | null;
  remainingNumbers: Record<number, number>;
  difficulty: Difficulty;
  canUndo: boolean;
  canRedo: boolean;
  elapsedTime: number;
  formattedTime: string;
  highScores: HighScores;
  savedGame: SavedGameState | null;
  resumeGame: () => void;
  undo: () => void;
  redo: () => void;
  setGameStatus: (status: GameStatus) => void;
  setSelectedValue: (value: number | null) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: (
    difficulty: Difficulty,
    boardString?: string,
    solutionString?: string
  ) => void;
  updateGame: (updatedCell: SudokuCell) => void;
  updateSavedGame: (gameState: SavedGameState) => void;
  resetGame: () => void;
  setTime: (time: number) => void;
}

const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

export function SudokuProvider({ children }: { children: React.ReactNode }) {
  const {
    saveToHistory,
    undo: undoHistory,
    redo: redoHistory,
    initializeHistory,
    canUndo,
    canRedo,
  } = useHistory();

  const {
    gameState: {
      board,
      solution,
      gameStatus,
      difficulty,
      selectedValue,
      elapsedTime,
    },
    setBoard,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    startGame,
    updateBoard,
    setSolution,
    resetGame,
    setTime,
  } = useGameState(initializeHistory);

  const { savedGame, updateSavedGame } = useSavedGame();

  const [highScores, setHighScores] = useState<HighScores>({});

  useEffect(() => {
    const savedScores = localStorage.getItem("sudokuHighScores");
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    updateSavedGame({
      board,
      solution,
      gameStatus,
      difficulty,
      elapsedTime,
      selectedValue,
    });
  }, [board, solution, gameStatus, difficulty, elapsedTime, selectedValue]);

  function resumeGame() {
    if (!savedGame) return;
    setGameStatus("playing");
    setBoard(savedGame.board);
    setDifficulty(savedGame.difficulty);
    setSolution(savedGame.solution);
    setSelectedValue(savedGame.selectedValue);
    setTime(savedGame.elapsedTime);
    initializeHistory(savedGame.board);
  }

  function updateGame(updatedCell: SudokuCell) {
    const newBoard = updateBoard(updatedCell);
    saveToHistory(newBoard, selectedValue);
  }

  const undo = useCallback(() => {
    const previousEntry = undoHistory();
    if (previousEntry) {
      setBoard(previousEntry.board);
      setSelectedValue(previousEntry.selectedValue);
    }
  }, [undoHistory]);

  const redo = useCallback(() => {
    const nextEntry = redoHistory();
    if (nextEntry) {
      setBoard(nextEntry.board);
      setSelectedValue(nextEntry.selectedValue);
    }
  }, [redoHistory]);

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

      const newScore: HighScore = {
        time: elapsedTime,
        date: new Date().toISOString(),
      };

      setHighScores((prevScores) => {
        const updatedScores = { ...prevScores };
        const difficultyScores = updatedScores[difficulty] || [];

        const newScores = [...difficultyScores, newScore]
          .sort((a, b) => a.time - b.time)
          .slice(0, 5);

        updatedScores[difficulty] = newScores;

        localStorage.setItem("sudokuHighScores", JSON.stringify(updatedScores));

        return updatedScores;
      });
    }
  }, [gameStatus]);

  const remainingNumbers = calculateRemainingNumbers(board, solution);

  useKeyboardControls({
    selectedValue,
    setSelectedValue,
    undo,
    redo,
  });

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
    savedGame,
    resumeGame,
    undo,
    redo,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    startGame,
    updateGame,
    updateSavedGame,
    resetGame,
    setTime,
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
