import { useSudoku } from "@/context/sudoku-context";

import { difficultyOptions } from "@/lib/constants";
import { HelpModal } from "@/components/sudoku/help-modal";
import { HighScoresModal } from "@/components/sudoku/high-scores-modal";

export function SudokuTopBar() {
  const { formattedTime, difficulty } = useSudoku();

  return (
    <div className="w-full flex items-center justify-between">
      <div>
        Difficulty:{" "}
        {difficultyOptions.find((option) => option.value === difficulty)?.label}
      </div>

      <span className="font-mono text-lg">{formattedTime}</span>

      <div className="flex gap-2">
        <HelpModal />
        <HighScoresModal />
      </div>
    </div>
  );
}
