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

export function generatePuzzle(difficulty: number): {
  board: number[][];
  solution: number[][];
} {
  // Create empty board
  const board: number[][] = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes (these are independent)
  for (let i = 0; i < 9; i += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

  // Create a list of all positions
  const positions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Calculate how many cells to remove based on difficulty
  const cellsToRemove = Math.floor(81 * difficulty);
  let removed = 0;

  // Try removing numbers while ensuring uniqueness
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;

    const temp = board[row][col];
    board[row][col] = 0;

    // Check if the puzzle still has a unique solution
    if (!hasUniqueSolution(board)) {
      board[row][col] = temp; // Put the number back
    } else {
      removed++;
    }
  }

  return { board, solution };
}

// Helper function to check if a puzzle has a unique solution
function hasUniqueSolution(board: number[][]): boolean {
  const tempBoard = board.map((row) => [...row]);
  let solutions = 0;

  function isValid(num: number, row: number, col: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (tempBoard[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (tempBoard[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tempBoard[boxRow + i][boxCol + j] === num) return false;
      }
    }

    return true;
  }

  function countSolutions(row = 0, col = 0): void {
    if (solutions > 1) return; // Early exit if multiple solutions found

    if (row === 9) {
      solutions++;
      return;
    }

    // Move to next cell
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    // If cell is filled, move to next cell
    if (tempBoard[row][col] !== 0) {
      countSolutions(nextRow, nextCol);
      return;
    }

    // Try numbers 1-9
    for (let num = 1; num <= 9 && solutions <= 1; num++) {
      if (isValid(num, row, col)) {
        tempBoard[row][col] = num;
        countSolutions(nextRow, nextCol);
        tempBoard[row][col] = 0;
      }
    }
  }

  countSolutions();
  return solutions === 1;
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
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

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
