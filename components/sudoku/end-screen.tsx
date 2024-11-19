import { useSudoku } from "@/context/sudoku-context";
import { formatTime } from "@/lib/utils";
import { difficultyOptions } from "@/lib/constants";

export function SudokuEndScreen() {
  const { setGameStatus, formattedTime, difficulty, highScores, elapsedTime } =
    useSudoku();

  const difficultyLabel =
    difficultyOptions.find((d) => d.value === difficulty)?.label || "Unknown";
  const difficultyHighScores = highScores[difficultyLabel] || [];
  const bestTime = difficultyHighScores[0]?.time;
  const isNewBestTime = bestTime === elapsedTime;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Puzzle Complete! 🎉</h2>
      <p className="text-lg mb-2">
        Difficulty:{" "}
        {difficultyOptions.find((d) => d.value === difficulty)?.label}
      </p>
      <p className="text-lg mb-2">Time: {formattedTime}</p>
      {bestTime && (
        <p className="text-lg mb-6">
          Best Time: {formatTime(bestTime)}
          {isNewBestTime && " (New Record! 🏆)"}
        </p>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => setGameStatus("start")}
      >
        New Puzzle
      </button>
    </div>
  );
}
