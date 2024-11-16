import { cn } from "@/lib/utils";
import { SudokuCell } from "@/lib/types";
import { useSudoku } from "@/context/sudoku-context";

export function Cell({ cell }: { cell: SudokuCell }) {
  const { selectedValue, setSelectedValue, updateGame, solution } = useSudoku();
  const { row, column } = cell;

  function handleCellChange(
    cell: SudokuCell,
    event: React.KeyboardEvent<HTMLDivElement>
  ) {
    if (cell.isFixed) return;

    if (event.metaKey || event.ctrlKey) return;

    const key = event.key;
    if (!/^[1-9]$/.test(key) && key !== "Backspace" && key !== "Delete") {
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
        "w-full aspect-square flex items-center justify-center border font-bold select-none",
        "text-[min(5vw,2rem)]",
        "bg-white",
        cell.isFixed ? "bg-gray-100 cursor-default" : "cursor-pointer",
        selectedValue && cell.value === selectedValue && "bg-blue-200",
        !cell.isFixed &&
          cell.value &&
          cell.value !== solution[row][column] &&
          "text-red-500",
        column % 3 === 2 && column !== 8 && "border-r-2 border-r-gray-400",
        row % 3 === 2 && row !== 8 && "border-b-2 border-b-gray-400",
        // "focus:outline-none focus:border-blue-400"
        "focus:outline-none focus:bg-blue-200"
      )}
    >
      {cell.value ? (
        cell.value
      ) : (
        <div className="grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 w-full h-full text-[min(2.4vw,0.8rem)]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center rounded-[2px]",
                cell.notes.includes(num) &&
                  num === selectedValue &&
                  "bg-blue-300"
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
