import { cn } from "@/lib/utils";
import { Cell } from "./cell";
import { useSudoku } from "@/context/sudoku-context";

export function SudokuBoard() {
  const { board } = useSudoku();

  if (!board || board.length !== 9) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-9 w-full aspect-square transition-transform"
      )}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell key={`${rowIndex}-${colIndex}`} cell={cell} />
        ))
      )}
    </div>
  );
}
