"use client";

import { SudokuProvider, useSudoku } from "@/context/sudoku-context";
import { SudokuNumberBar } from "@/components/sudoku/number-bar";
import { SudokuBoard } from "@/components/sudoku/board";
import { SudokuStartScreen } from "@/components/sudoku/start-screen";
import { SudokuEndScreen } from "@/components/sudoku/end-screen";

export default function SudokuWrapper() {
  return (
    <SudokuProvider>
      <Sudoku />
    </SudokuProvider>
  );
}

function Sudoku() {
  const { board, gameStatus } = useSudoku();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="size-full max-w-2xl flex flex-col items-center gap-4">
        {gameStatus === "start" && <SudokuStartScreen />}
        {gameStatus === "playing" && (
          <>
            <SudokuBoard />
            <SudokuNumberBar />
          </>
        )}
        {gameStatus === "complete" && <SudokuEndScreen />}
      </div>
    </main>
  );
}
