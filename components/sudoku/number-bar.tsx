import { useSudoku } from "@/contexts/sudoku-context";

export function NumberBar() {
  const { remainingNumbers, selectedValue, setSelectedValue } = useSudoku();

  function handleNumberSelect(num: number) {
    setSelectedValue(num === selectedValue ? null : num);
  }

  return (
    <div className="grid grid-cols-9 gap-1 w-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
        const remaining = remainingNumbers[num] || 0;
        const visible = remaining > 0;

        return (
          <button
            key={num}
            onClick={() => handleNumberSelect(num)}
            className={`
              aspect-square rounded-md flex flex-col items-center justify-center
              border border-gray-200 shadow-sm
              ${selectedValue === num ? "bg-blue-100" : "bg-white"}
              ${!visible && "opacity-0 pointer-events-none"}
            `}
          >
            <span className="text-lg font-bold">{num}</span>
            <span className="text-xs text-gray-500">{remaining}</span>
          </button>
        );
      })}
    </div>
  );
}
