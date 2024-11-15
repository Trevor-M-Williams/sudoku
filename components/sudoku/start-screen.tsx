import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function SudokuStartScreen() {
  const { setGameStatus, difficulty, setDifficulty } = useSudoku();

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Label>Select Difficulty</Label>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <Button
            key={value}
            variant={difficulty === value ? "default" : "outline"}
            onClick={() => setDifficulty(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Button onClick={() => setGameStatus("playing")}>Start</Button>
    </div>
  );
}
