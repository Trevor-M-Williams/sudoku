import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";
import { difficulties } from "@/lib/constants";

export function SudokuStartScreen() {
  const { setGameStatus, setDifficulty } = useSudoku();

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="text-lg font-bold">Select Difficulty</div>

      {difficulties.map(({ label, value }, index) => (
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
