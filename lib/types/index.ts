export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  row: number;
  column: number;
  notes: number[];
};

export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export type GameStatus = "start" | "playing" | "complete";

export type HighScore = {
  time: number;
  date: string;
};

export type HighScores = {
  [difficulty: string]: HighScore[];
};

export type SavedGameState = {
  board: SudokuCell[][];
  solution: number[][];
  gameStatus: GameStatus;
  difficulty: Difficulty;
  elapsedTime: number;
  selectedValue: number | null;
};
