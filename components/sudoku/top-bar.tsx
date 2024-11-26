import { useSudoku } from "@/context/sudoku-context";

import { HelpModal } from "@/components/sudoku/help-modal";
import { Button } from "../ui/button";
import { ArrowLeftIcon, UserIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function SudokuTopBar() {
  const { formattedTime, difficulty, setGameStatus, errorCount } = useSudoku();

  return (
    <div className="w-full grid grid-cols-3 place-items-center">
      <div className="flex items-center gap-4 justify-self-start">
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
        <div>
          <div className="text-sm">Difficulty: {difficulty}</div>
          <div className="text-xs text-muted-foreground">
            Mistakes: {errorCount}
          </div>
        </div>
      </div>

      <span className="font-mono text-lg">{formattedTime}</span>

      <div className="flex gap-2 justify-self-end items-center">
        <HelpModal />
        <Button variant="outline" size="icon">
          <UserIcon />
          <div className="absolute z-10 opacity-0">
            <UserButton />
          </div>
        </Button>
      </div>
    </div>
  );
}
