import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";
import { HighScoresModal } from "@/components/sudoku/high-scores-modal";
import { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";
import { ClockIcon } from "lucide-react";
import { CalendarModal } from "@/components/sudoku/calendar-modal";

export function SudokuStartScreen() {
  const { savedGame, startGame, resumeGame, setTime } = useSudoku();

  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"];

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="text-3xl font-bold">Sudoku</div>
        <div className="flex gap-2">
          <HighScoresModal />
          <CalendarModal />
        </div>
      </div>

      {difficulties.map((difficulty, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-16 text-lg"
          onClick={() => {
            startGame(difficulty);
          }}
        >
          {difficulty}
        </Button>
      ))}

      <Button
        className={cn(
          "h-16 text-lg bg-blue-500 hover:bg-blue-600 flex flex-col gap-0",
          savedGame ? "" : "opacity-0 pointer-events-none"
        )}
        onClick={resumeGame}
      >
        <span>Resume</span>
        <div className="text-xs font-semibold flex items-center gap-1">
          <ClockIcon style={{ width: "1em", height: "1em" }} />
          <span>{formatTime(savedGame?.elapsedTime || 0)}</span>
          <span>-</span>
          <span>{savedGame?.difficulty}</span>
        </div>
      </Button>
    </div>
  );
}
