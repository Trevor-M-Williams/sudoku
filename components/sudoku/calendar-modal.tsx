import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import {
  getCompletedPuzzles,
  getDailyPuzzle,
  getPuzzleScores,
} from "@/actions/puzzles";
import { useSudoku } from "@/context/sudoku-context";
import { CalendarIcon } from "lucide-react";
import { DailyPuzzleScore } from "@/lib/types";

type TopScore = {
  id: number;
  userId: string;
  time: number;
};

export function CalendarModal() {
  const [puzzles, setPuzzles] = useState<DailyPuzzleScore[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [topScores, setTopScores] = useState<TopScore[]>([]);
  const [userScore, setUserScore] = useState<TopScore | null>(null);
  const { startGame, setDailyPuzzleId } = useSudoku();

  useEffect(() => {
    const fetchPuzzles = async () => {
      const puzzles = await getCompletedPuzzles();
      setPuzzles(puzzles);
    };
    fetchPuzzles();
  }, []);

  async function handleSelect(date: Date | undefined) {
    if (!date) return;

    const completedPuzzle = puzzles.find(
      (puzzle) =>
        createUTCDate(puzzle.date).toDateString() === date.toDateString()
    );

    if (completedPuzzle) {
      if (completedPuzzle.puzzleId) {
        const { topScores, userScore } = await getPuzzleScores(
          completedPuzzle.puzzleId
        );
        setTopScores(topScores);
        setUserScore(userScore || null);
      }
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const { id, difficulty, board, solution } = await getDailyPuzzle(
      formattedDate
    );
    startGame(difficulty, board, solution);
    setDailyPuzzleId(id);
  }

  const completedDates = puzzles.map((puzzle) => {
    return createUTCDate(puzzle.date);
  });

  return (
    <Dialog onOpenChange={() => setTopScores([])}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CalendarIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {topScores.length > 0
              ? date?.toDateString()
              : "Select a daily puzzle"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center min-h-[21rem]">
          {topScores.length > 0 ? (
            <div>
              <CalendarIcon
                className="absolute top-[1.1rem] right-10 size-[0.8rem] cursor-pointer text-gray-600 hover:text-black"
                onClick={() => setTopScores([])}
              />
              {topScores.map((score) => {
                if (score.userId === userScore?.userId) {
                  return (
                    <div key={score.id} className="text-blue-500">
                      {score.userId.slice(0, 4)} - {score.time}
                    </div>
                  );
                }
                return (
                  <div key={score.id}>
                    {score.userId.slice(0, 4)} - {score.time}
                  </div>
                );
              })}
            </div>
          ) : (
            <Calendar
              mode="single"
              onSelect={(date) => {
                setDate(date);
                handleSelect(date);
              }}
              disabled={{ before: new Date("2024-1-1"), after: new Date() }}
              modifiers={{ completed: completedDates }}
              modifiersStyles={{
                completed: {
                  backgroundColor: "#0af",
                  color: "white",
                  borderRadius: "0px",
                },
              }}
              initialFocus
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function createUTCDate(dateString: string): Date {
  // I've been fighting the Date api for far too long. Take it or leave it.
  return new Date(`${dateString}T12:00:00Z`);
}
