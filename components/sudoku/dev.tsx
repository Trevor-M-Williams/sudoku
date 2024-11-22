import { useSudoku } from "@/context/sudoku-context";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

export function ToggleCompleteButton() {
  const { gameStatus, setGameStatus } = useSudoku();

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md absolute top-0 right-0"
      onClick={() =>
        setGameStatus(gameStatus === "playing" ? "complete" : "playing")
      }
    >
      Toggle Complete
    </button>
  );
}
