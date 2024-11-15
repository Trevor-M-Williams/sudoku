import { cn } from "@/lib/utils";
import { SudokuCell } from "@/lib/types";
import { useSudoku } from "@/contexts/sudoku-context";

export function Cell({
  cell,
  rowIndex,
  colIndex,
}: {
  cell: SudokuCell;
  rowIndex: number;
  colIndex: number;
}) {
  const { selectedValue, setSelectedValue, board, updateGame, solution } =
    useSudoku();

  function handleCellChange(
    rowIndex: number,
    colIndex: number,
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (board[rowIndex][colIndex].isFixed) return;

    const key = event.key;
    if (!/^[1-9]$/.test(key) && key !== "Backspace" && key !== "Delete") {
      return;
    }

    if (event.metaKey || event.ctrlKey) {
      return;
    }

    const newValue =
      key === "Backspace" || key === "Delete" ? null : parseInt(key);

    const updatedCell = {
      row: rowIndex,
      column: colIndex,
      value: newValue,
      isFixed: false,
      notes: [],
    };
    setSelectedValue(newValue);
    updateGame(updatedCell);
  }

  function handleCellClick(
    rowIndex: number,
    colIndex: number,
    event: React.MouseEvent
  ) {
    const cellIsFixed = board[rowIndex][colIndex].isFixed;

    if (!cellIsFixed && (event.metaKey || event.ctrlKey)) {
      const updatedCell = {
        row: rowIndex,
        column: colIndex,
        value: selectedValue,
        isFixed: false,
        notes: [],
      };
      updateGame(updatedCell);
    } else if (event.altKey && selectedValue) {
      event.preventDefault();
      const currentNotes = board[rowIndex][colIndex].notes;
      const noteIndex = currentNotes.indexOf(selectedValue);
      const updatedCell = {
        ...board[rowIndex][colIndex],
        notes:
          noteIndex >= 0
            ? currentNotes.filter((n) => n !== selectedValue)
            : [...currentNotes, selectedValue],
      };
      updateGame(updatedCell);
    } else {
      setSelectedValue(board[rowIndex][colIndex].value);
    }
  }

  return (
    <div
      tabIndex={cell.isFixed ? -1 : 0}
      onKeyDown={(e) => handleCellChange(rowIndex, colIndex, e)}
      onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
      className={cn(
        "w-full aspect-square flex items-center justify-center text-lg border font-bold",
        "bg-white",
        cell.isFixed ? "bg-gray-100 cursor-default" : "cursor-pointer",
        selectedValue && cell.value === selectedValue && "bg-blue-100",
        !cell.isFixed &&
          cell.value &&
          cell.value !== solution[rowIndex][colIndex] &&
          "text-red-500",
        colIndex % 3 === 2 && colIndex !== 8 && "border-r-2 border-r-gray-400",
        rowIndex % 3 === 2 && rowIndex !== 8 && "border-b-2 border-b-gray-400",
        "focus:outline-none focus:bg-blue-100"
      )}
    >
      {cell.value ? (
        cell.value
      ) : (
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 w-full h-full text-[10px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center rounded-[2px]",
                cell.notes.includes(num) &&
                  num === selectedValue &&
                  "bg-blue-200"
              )}
            >
              {cell.notes.includes(num) ? num : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
