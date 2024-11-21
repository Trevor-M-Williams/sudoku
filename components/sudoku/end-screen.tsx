import { useSudoku } from "@/context/sudoku-context";
import { formatTime } from "@/lib/utils";

export function SudokuEndScreen() {
  const { formattedTime, difficulty, highScores, elapsedTime, resetGame } =
    useSudoku();

  const difficultyHighScores = highScores[difficulty] || [];
  const bestTime = difficultyHighScores[0]?.time;
  const isNewBestTime = bestTime === elapsedTime;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
      <p className="text-lg mb-2">Difficulty: {difficulty}</p>
      <p className="text-lg mb-2">
        Time: {formattedTime}
        {isNewBestTime && " 🏆"}
      </p>
      {bestTime && (
        <p className="text-lg mb-6">Best Time: {formatTime(bestTime)}</p>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={resetGame}
      >
        New Puzzle
      </button>
    </div>
  );
}
