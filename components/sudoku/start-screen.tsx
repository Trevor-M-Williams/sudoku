import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";
import { difficultyOptions } from "@/lib/constants";
import { HighScoresModal } from "./high-scores-modal";

export function SudokuStartScreen() {
  const { setGameStatus, setDifficulty } = useSudoku();

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="text-3xl font-bold">Sudoku</div>
        <HighScoresModal />
      </div>

      {difficultyOptions.map(({ label, value }, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-16 text-lg"
          onClick={() => {
            setDifficulty(value);
            setGameStatus("playing");
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
