import { useSudoku } from "@/context/sudoku-context";

export function SudokuEndScreen() {
  const { generateNewBoard, setGameStatus } = useSudoku();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Puzzle Complete! 🎉</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            generateNewBoard();
            setGameStatus("playing");
          }}
        >
          New Puzzle
        </button>
      </div>
    </div>
  );
}
