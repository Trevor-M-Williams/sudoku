"use client";

import { SudokuProvider, useSudoku } from "@/contexts/sudoku-context";
import { NumberBar } from "@/components/sudoku/number-bar";
import { SudokuBoard } from "@/components/sudoku/board";
import { SudokuModal } from "@/components/sudoku/modal";

export default function SudokuWrapper() {
  return (
    <SudokuProvider>
      <Sudoku />
    </SudokuProvider>
  );
}

function Sudoku() {
  const { board } = useSudoku();

  if (!board || board.length === 0) return null;
  
  return (
    <main className="flex min-h-screen items-center justify-center p-2">
      <div className="size-full max-w-2xl flex flex-col items-center gap-4">
        <SudokuBoard />
        <NumberBar />
        <SudokuModal />
      </div>
    </main>
  );
}
