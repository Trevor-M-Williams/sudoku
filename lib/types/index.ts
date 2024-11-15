export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  row: number;
  column: number;
  notes: number[];
};
