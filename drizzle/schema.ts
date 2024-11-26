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
  puzzleId: integer("puzzle_id")
    .notNull()
    .references(() => DailyPuzzles.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  time: integer("time").notNull(),
  score: integer("score").notNull(),
  errorCount: integer("error_count").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
});
