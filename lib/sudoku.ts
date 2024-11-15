import { SudokuCell } from "./types";

export const calculateRemainingNumbers = (
  board: SudokuCell[][],
  solution: number[][]
) => {
  const counts: { [key: number]: number } = {};
  // Initialize counts for numbers 1-9
  for (let i = 1; i <= 9; i++) {
    counts[i] = 9;
  }

  // Subtract the count of each number that appears in the board
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.value) {
        // Only decrement count if number is in correct position
        if (cell.value === solution[rowIndex][colIndex]) {
          counts[cell.value]--;
        }
      }
    });
  });

  return counts;
};

export function checkCompletion(board: SudokuCell[][], solution: number[][]) {
  const isComplete = board.every((row, rowIndex) =>
    row.every((cell, colIndex) => cell.value === solution[rowIndex][colIndex])
  );

  return isComplete;
}

export function generatePuzzle(difficulty: number = 0.5): {
  board: number[][];
  solution: number[][];
} {
  // Create empty board
  const board: number[][] = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes (these are independent)
  for (let i = 0; i < 9; i += 3) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = i; row < i + 3; row++) {
      for (let col = i; col < i + 3; col++) {
        const randomIndex = Math.floor(Math.random() * nums.length);
        board[row][col] = nums[randomIndex];
        nums.splice(randomIndex, 1);
      }
    }
  }

  // Solve the rest of the puzzle
  solveSudoku(board);

  // Create a copy of the solved board
  const solution = board.map((row) => [...row]);

  // Remove numbers based on difficulty (0.0 - 1.0)
  const cellsToRemove = Math.floor(81 * difficulty);
  for (let i = 0; i < cellsToRemove; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (board[row][col] === 0);
    board[row][col] = 0;
  }

  return { board, solution };
}

export function isValidMove(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  let boxRow = Math.floor(row / 3) * 3;
  let boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        (boxRow + i !== row || boxCol + j !== col) &&
        board[boxRow + i][boxCol + j] === num
      ) {
        return false;
      }
    }
  }

  return true;
}

export function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
