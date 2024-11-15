import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function SudokuStartScreen() {
  const { setGameStatus, difficulty, setDifficulty } = useSudoku();

  return (
    <div>
      <h1>Sudoku</h1>
      <div className="flex flex-col gap-2">
        <Label>Difficulty</Label>
        <Slider
          value={[difficulty]}
          onValueChange={(value) => setDifficulty(value[0])}
          min={0.1}
          max={1}
          step={0.1}
        />
      </div>
      <Button onClick={() => setGameStatus("playing")}>Start</Button>
    </div>
  );
}
