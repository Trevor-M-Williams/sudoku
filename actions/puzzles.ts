"use server";

import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { DailyPuzzles } from "@/drizzle/schema";

export async function getDailyPuzzle(date: string) {
  const puzzles = await db
    .select()
    .from(DailyPuzzles)
    .where(eq(DailyPuzzles.date, date));

  return puzzles[0];
}
