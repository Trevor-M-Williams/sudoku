import { pgTable, serial, timestamp, text, char } from "drizzle-orm/pg-core";

import { Difficulty } from "@/lib/types";

export const DailyPuzzles = pgTable("daily_puzzles", {
  id: serial("id").primaryKey(),
  date: text("date").unique().notNull(),
  difficulty: text("difficulty").$type<Difficulty>().notNull(),
  board: char("board", { length: 81 }).notNull(),
  solution: char("solution", { length: 81 }).notNull(),
});
