"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  generatePuzzle,
  isValidMove,
  calculateRemainingNumbers,
  checkCompletion,
} from "@/lib/sudoku";
import { SudokuCell } from "@/lib/types";

import confetti from "canvas-confetti";

interface SudokuContextType {
  board: SudokuCell[][];
  solution: number[][];
  selectedValue: number | null;
  isComplete: boolean;
  remainingNumbers: Record<number, number>;
  setSelectedValue: (value: number | null) => void;
  generateNewBoard: () => void;
  updateGame: (updatedCell: SudokuCell) => void;
}

const SudokuContext = createContext<SudokuContextType | undefined>(undefined);

export function SudokuProvider({ children }: { children: React.ReactNode }) {
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const difficulty = 0.5;

  // TODO move logic to lib
  function generateNewBoard() {
    setIsComplete(false);
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
  }

  // TODO move logic to lib
  function updateGame(updatedCell: SudokuCell) {
    const newBoard = board.map((row, rowIndex) =>
      rowIndex === updatedCell.row
        ? row.map((cell, colIndex) =>
            colIndex === updatedCell.column ? updatedCell : cell
          )
        : row
    );

    // Clear notes when a value is placed
    if (updatedCell.value !== null) {
      // Clear notes in the same row, column, and square
      const squareStartRow = Math.floor(updatedCell.row / 3) * 3;
      const squareStartCol = Math.floor(updatedCell.column / 3) * 3;

      newBoard.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          // Skip the updated cell itself
          if (rowIndex === updatedCell.row && colIndex === updatedCell.column)
            return;

          // Check if cell is in same row, column, or square
          const isInSameRow = rowIndex === updatedCell.row;
          const isInSameCol = colIndex === updatedCell.column;
          const isInSameSquare =
            rowIndex >= squareStartRow &&
            rowIndex < squareStartRow + 3 &&
            colIndex >= squareStartCol &&
            colIndex < squareStartCol + 3;

          if (isInSameRow || isInSameCol || isInSameSquare) {
            cell.notes = cell.notes.filter(
              (note) => note !== updatedCell.value
            );
          }
        });
      });
    }

    setBoard(newBoard);

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
        setIsComplete(isComplete);
      }
    }

    return newBoard;
  }

  useEffect(() => {
    generateNewBoard();
  }, []);

  useEffect(() => {
    if (isComplete) {
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
  }, [isComplete]);

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

  const remainingNumbers = calculateRemainingNumbers(board, solution);

  const value = {
    board,
    solution,
    selectedValue,
    isComplete,
    remainingNumbers,
    setSelectedValue,
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
