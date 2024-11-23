import {
  pgTable,
  serial,
  timestamp,
  text,
  char,
  integer,
} from "drizzle-orm/pg-core";

import { Difficulty } from "@/lib/types";

export const DailyPuzzles = pgTable("daily_puzzles", {
  id: serial("id").primaryKey(),
  date: text("date").unique().notNull(),
  difficulty: text("difficulty").$type<Difficulty>().notNull(),
  board: char("board", { length: 81 }).notNull(),
  solution: char("solution", { length: 81 }).notNull(),
});

export const DailyPuzzleScores = pgTable("daily_puzzle_scores", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  puzzleId: text("puzzle_id").notNull(),
  time: integer("time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
