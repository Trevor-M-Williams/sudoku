import { useSudoku } from "@/context/sudoku-context";

import { HelpModal } from "@/components/sudoku/help-modal";
import { HighScoresModal } from "@/components/sudoku/high-scores-modal";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";

export function SudokuTopBar() {
  const { formattedTime, difficulty, setGameStatus, updateSavedGame } =
    useSudoku();

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="px-3 py-1 rounded"
          onClick={() => {
            setGameStatus("start");
          }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <div>Difficulty: {difficulty}</div>
      </div>

      <span className="font-mono text-lg">{formattedTime}</span>

      <div className="flex gap-2">
        <HelpModal />
        <HighScoresModal />
      </div>
    </div>
  );
}
