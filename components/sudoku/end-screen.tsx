"use client";

import { useEffect, useState } from "react";
import { useSudoku } from "@/context/sudoku-context";
import { getPuzzleScores } from "@/actions/sudoku";
import { Button } from "@/components/ui/button";
import { TopScores } from "./top-scores";
import { TopScore } from "@/lib/types";

export function SudokuEndScreen() {
  const { resetGame, dailyPuzzleId } = useSudoku();

  const [topScores, setTopScores] = useState<TopScore[]>([]);
  const [userScore, setUserScore] = useState<TopScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      if (dailyPuzzleId) {
        const { topScores, userScore } = await getPuzzleScores(dailyPuzzleId);
        setTopScores(topScores);
        setUserScore(userScore || null);
      }
      setLoading(false);
    };
    fetchScores();
  }, [dailyPuzzleId]);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4 items-center justify-center text-center">
      <h2 className="text-2xl font-bold">Puzzle Complete!</h2>

      {!loading && (
        <>
          <TopScores
            topScores={topScores}
            userScore={userScore}
            setTopScores={setTopScores}
          />

          {!userScore && (
            /* TODO: Show user score if they did not make the top 10 
            Ideally it would show where they rank in a table (scrollable?)
            */
            <></>
          )}
        </>
      )}

      <Button onClick={resetGame}>New Puzzle</Button>
    </div>
  );
}
