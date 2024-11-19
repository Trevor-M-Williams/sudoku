import { useSudoku } from "@/context/sudoku-context";

import { difficultyOptions } from "@/lib/constants";

export function SudokuTopBar() {
  const { formattedTime, difficulty } = useSudoku();

  return (
    <div className="w-full flex items-center justify-between">
      <div>
        Difficulty:{" "}
        {difficultyOptions.find((option) => option.value === difficulty)?.label}
      </div>

      <span className="font-mono text-lg">{formattedTime}</span>
    </div>
  );
}
