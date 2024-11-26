"use client";

import { SudokuProvider, useSudoku } from "@/context/sudoku-context";
import { SudokuBoard } from "@/components/sudoku/board";
import { SudokuTopBar } from "@/components/sudoku/top-bar";
import { SudokuNumberBar } from "@/components/sudoku/number-bar";
import { SudokuStartScreen } from "@/components/sudoku/start-screen";
import { SudokuEndScreen } from "@/components/sudoku/end-screen";
import { UsernameModal } from "@/components/sudoku/username-modal";

export default function SudokuWrapper() {
  return (
    <SudokuProvider>
      <Sudoku />
      <UsernameModal />
    </SudokuProvider>
  );
}

function Sudoku() {
  const { gameStatus } = useSudoku();

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="size-full max-w-2xl flex flex-col items-center gap-4">
        {gameStatus === "start" && <SudokuStartScreen />}
        {gameStatus === "playing" && (
          <>
            <SudokuTopBar />
            <SudokuBoard />
            <SudokuNumberBar />
          </>
        )}
        {gameStatus === "complete" && <SudokuEndScreen />}
      </div>
    </main>
  );
}
