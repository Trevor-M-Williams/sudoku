"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
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
  SavedGameState,
  User,
} from "@/lib/types";
import confetti from "canvas-confetti";
import { saveDailyPuzzleScore } from "@/actions/sudoku";
import { useAuth } from "@clerk/nextjs";
import { getUserById } from "@/actions/sudoku";

interface SudokuContextType {
  gameStatus: GameStatus;
  board: SudokuCell[][];
  solution: number[][];
  selectedValue: number | null;
  remainingNumbers: Record<number, number>;
  difficulty: Difficulty;
  dailyPuzzleId: number | null;
  canUndo: boolean;
  canRedo: boolean;
  elapsedTime: number;
  formattedTime: string;
  score: number;
  savedGame: SavedGameState | null;
  user: User | null;
  errorCount: number;
  resumeGame: () => void;
  undo: () => void;
  redo: () => void;
  setGameStatus: (status: GameStatus) => void;
  setSelectedValue: (value: number | null) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setDailyPuzzleId: (id: number) => void;
  startGame: (
    difficulty: Difficulty,
    boardString?: string,
    solutionString?: string
  ) => void;
  updateGame: (updatedCell: SudokuCell) => void;
  updateSavedGame: (gameState: SavedGameState) => void;
  resetGame: () => void;
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
    board,
    solution,
    gameStatus,
    difficulty,
    selectedValue,
    elapsedTime,
    dailyPuzzleId,
    errorCount,
    setBoard,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    setDailyPuzzleId,
    startGame,
    updateBoard,
    setSolution,
    resetGame,
    setTime,
  } = useGameState(initializeHistory);

  const { savedGame, updateSavedGame } = useSavedGame();

  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (userId) checkUser(userId);

    async function checkUser(userId: string) {
      const user = await getUserById(userId);
      setUser(user);
    }
  }, [userId]);

  async function handleGameComplete() {
    if (!dailyPuzzleId) return;

    shootConfetti();

    const scoreMultiplier =
      difficulty === "Easy"
        ? 1
        : difficulty === "Medium"
        ? 4
        : difficulty === "Hard"
        ? 16
        : 64;

    let score =
      Math.floor((10000 / elapsedTime) * scoreMultiplier) -
      errorCount * scoreMultiplier * 10;
    score = Math.max(score, 1);
    setScore(score);

    if (dailyPuzzleId) {
      const { error, message } = await saveDailyPuzzleScore(
        dailyPuzzleId,
        elapsedTime,
        score,
        errorCount
      );
      if (error) {
        console.error(message);
      }
    }
  }

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
      handleGameComplete();
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
    dailyPuzzleId,
    canUndo,
    canRedo,
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    savedGame,
    user,
    errorCount,
    score,
    resumeGame,
    undo,
    redo,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    setDailyPuzzleId,
    startGame,
    updateGame,
    updateSavedGame,
    resetGame,
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

function shootConfetti() {
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
}
