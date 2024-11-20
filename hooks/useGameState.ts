import { useState, useCallback } from "react";
import { SudokuCell, Difficulty, GameStatus } from "@/lib/types";
import { generatePuzzle, checkCompletion } from "@/lib/sudoku";

interface GameState {
  board: SudokuCell[][];
  solution: number[][];
  gameStatus: GameStatus;
  difficulty: Difficulty;
  selectedValue: number | null;
}

export function useGameState(
  initializeHistory: (board: SudokuCell[][]) => void
) {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");

  const generateNewBoard = useCallback(
    (difficulty: Difficulty) => {
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
      initializeHistory(initialBoard);
      localStorage.removeItem("sudokuGameState");
    },
    [initializeHistory]
  );

  const updateBoard = useCallback(
    (updatedCell: SudokuCell) => {
      const newBoard = board.map((row) =>
        row.map((cell) => ({
          ...cell,
          notes: [...cell.notes],
        }))
      );

      newBoard[updatedCell.row][updatedCell.column] = {
        ...updatedCell,
        notes: [...updatedCell.notes],
      };

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
              newBoard[rowIndex][colIndex] = {
                ...cell,
                notes: cell.notes.filter((note) => note !== updatedCell.value),
              };
            }
          });
        });
      }

      setBoard(newBoard);

      if (updatedCell.value !== null) {
        const isComplete = checkCompletion(newBoard, solution);
        if (isComplete) {
          setGameStatus("complete");
          setBoard([]);
          setSolution([]);
          setSelectedValue(null);
        }
      }

      return newBoard;
    },
    [board, solution]
  );

  const resetGame = useCallback(() => {
    setBoard([]);
    setSolution([]);
    setSelectedValue(null);
    setGameStatus("start");
  }, []);

  return {
    gameState: {
      board,
      solution,
      gameStatus,
      difficulty,
      selectedValue,
    },
    setBoard,
    setSolution,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    generateNewBoard,
    updateBoard,
    resetGame,
  };
}
