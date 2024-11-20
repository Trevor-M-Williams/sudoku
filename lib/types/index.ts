export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  row: number;
  column: number;
  notes: number[];
};

export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export type GameStatus = "start" | "playing" | "complete";
