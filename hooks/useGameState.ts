import { useState, useCallback, useEffect } from "react";
import { SudokuCell, Difficulty, GameStatus } from "@/lib/types";
import { generatePuzzle, checkCompletion } from "@/lib/sudoku";

export function useGameState(
  initializeHistory: (board: SudokuCell[][]) => void
) {
  const [gameStatus, setGameStatus] = useState<GameStatus>("start");
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dailyPuzzleId, setDailyPuzzleId] = useState<string | null>(null);

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

  const setTime = (time: number) => setElapsedTime(time);

  const startGame = (
    difficulty: Difficulty,
    boardString?: string,
    solutionString?: string
  ) => {
    let board, solution;
    if (!boardString || !solutionString) {
      const { boardString, solutionString } = generatePuzzle(difficulty);
      board = convertStringToSudokuArray(boardString);
      solution = convertStringToSudokuArray(solutionString);
    } else {
      board = convertStringToSudokuArray(boardString);
      solution = convertStringToSudokuArray(solutionString);
    }

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

    setTime(0);
    setBoard(initialBoard);
    setDifficulty(difficulty);
    setGameStatus("playing");
    initializeHistory(initialBoard);
    localStorage.removeItem("sudokuGameState");
  };

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
      elapsedTime,
      dailyPuzzleId,
    },
    setBoard,
    setSolution,
    setGameStatus,
    setSelectedValue,
    setDifficulty,
    setDailyPuzzleId,
    startGame,
    updateBoard,
    resetGame,
    setTime,
  };
}

function convertStringToSudokuArray(rawString: string) {
  const sudokuArray = Array(9)
    .fill(null)
    .map((_, i) =>
      Array(9)
        .fill(null)
        .map((_, j) => parseInt(rawString[i * 9 + j]))
    );

  return sudokuArray;
}
