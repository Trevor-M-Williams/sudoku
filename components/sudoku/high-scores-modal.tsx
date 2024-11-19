import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSudoku } from "@/context/sudoku-context";
import { formatTime } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function HighScoresModal() {
  const { highScores } = useSudoku();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trophy className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>High Scores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(highScores).map(([difficulty, scores]) => (
            <div key={difficulty}>
              <h3 className="font-medium mb-2">{difficulty}</h3>
              {scores.length > 0 ? (
                <ul className="space-y-1">
                  {scores.map((score, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{new Date(score.date).toLocaleDateString()}</span>
                      <span className="font-medium">
                        {formatTime(score.time)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No scores yet</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
