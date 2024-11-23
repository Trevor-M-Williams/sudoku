import { useSudoku } from "@/context/sudoku-context";
import { Button } from "../ui/button";

export function SudokuEndScreen() {
  const { formattedTime, difficulty, resetGame } = useSudoku();

  return (
    <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
      <p className="text-lg mb-2">Difficulty: {difficulty}</p>
      <p className="text-lg mb-2">Time: {formattedTime}</p>
      <Button onClick={resetGame}>New Puzzle</Button>
    </div>
  );
}
