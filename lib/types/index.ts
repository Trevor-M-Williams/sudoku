export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  row: number;
  column: number;
  notes: number[];
};

export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export type GameStatus = "start" | "playing" | "complete";

export type SavedGameState = {
  board: SudokuCell[][];
  solution: number[][];
  gameStatus: GameStatus;
  difficulty: Difficulty;
  elapsedTime: number;
  selectedValue: number | null;
};

export type DailyPuzzleScore = {
  id: number;
  puzzleId: number;
  time: number;
  date: string;
  createdAt: Date;
};

export type User = {
  id: string;
  username: string;
};

export type TopScore = {
  id: number;
  userId: string;
  username: string;
  time: number;
  score: number;
  errorCount: number;
};
