import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";

export function SudokuEndScreen() {
  const { formattedTime, difficulty, resetGame } = useSudoku();

  return (
    <div className="w-full max-w-2xl flex flex-col gap-2 items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Puzzle Complete!</h2>
      <p className="text-lg">Difficulty: {difficulty}</p>
      <p className="text-lg">Time: {formattedTime}</p>
      <Button onClick={resetGame}>New Puzzle</Button>
    </div>
  );
}
