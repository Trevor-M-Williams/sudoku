import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { getDailyPuzzle } from "@/actions/puzzles";
import { useSudoku } from "@/context/sudoku-context";
import { CalendarIcon } from "lucide-react";

export function CalendarModal() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { startGame } = useSudoku();

  async function handleSelect(date: Date | undefined) {
    if (!date) return;

    const formattedDate = date.toISOString().split("T")[0];
    const { difficulty, board, solution } = await getDailyPuzzle(formattedDate);
    startGame(difficulty, board, solution);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CalendarIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select a daily puzzle</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              handleSelect(date);
            }}
            disabled={{ after: new Date() }}
            initialFocus
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
