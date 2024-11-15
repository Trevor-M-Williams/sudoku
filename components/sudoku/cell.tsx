import { cn } from "@/lib/utils";
import { SudokuCell } from "@/lib/types";
import { useSudoku } from "@/contexts/sudoku-context";

export function Cell({ cell }: { cell: SudokuCell }) {
  const { selectedValue, setSelectedValue, updateGame, solution } = useSudoku();
  const { row, column } = cell;

  function handleCellChange(
    cell: SudokuCell,
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (cell.isFixed) return;

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
      ...cell,
      value: newValue,
      notes: [],
    };

    setSelectedValue(newValue);
    updateGame(updatedCell);
  }

  function handleCellClick(cell: SudokuCell, event: React.MouseEvent) {
    const cellIsFixed = cell.isFixed;
    const cellIsEmpty = !cell.value;
    const metaKeyPressed = event.metaKey || event.ctrlKey;
    const altKeyPressed = event.altKey;

    if (!cellIsFixed && metaKeyPressed) {
      // Cell is not fixed and the user is holding down the meta key
      const updatedCell = {
        ...cell,
        value: selectedValue,
        isFixed: false,
        notes: [],
      };
      updateGame(updatedCell);
    } else if (cellIsEmpty && altKeyPressed && selectedValue) {
      // Cell is empty, the user is holding down the alt key, and a number is selected
      event.preventDefault();
      const currentNotes = cell.notes;
      const noteIndex = currentNotes.indexOf(selectedValue);
      const updatedCell = {
        ...cell,
        notes:
          noteIndex >= 0
            ? currentNotes.filter((n) => n !== selectedValue)
            : [...currentNotes, selectedValue],
      };
      updateGame(updatedCell);
    } else {
      setSelectedValue(cell.value);
    }
  }

  return (
    <div
      tabIndex={cell.isFixed ? -1 : 0}
      onKeyDown={(e) => handleCellChange(cell, e)}
      onClick={(e) => handleCellClick(cell, e)}
      className={cn(
        "w-full aspect-square flex items-center justify-center text-lg border font-bold",
        "bg-white",
        cell.isFixed ? "bg-gray-100 cursor-default" : "cursor-pointer",
        selectedValue && cell.value === selectedValue && "bg-blue-100",
        !cell.isFixed &&
          cell.value &&
          cell.value !== solution[row][column] &&
          "text-red-500",
        column % 3 === 2 && column !== 8 && "border-r-2 border-r-gray-400",
        row % 3 === 2 && row !== 8 && "border-b-2 border-b-gray-400",
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