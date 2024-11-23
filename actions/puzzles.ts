"use server";

import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { DailyPuzzles, DailyPuzzleScores } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";

export async function getDailyPuzzle(date: string) {
  const puzzles = await db
    .select()
    .from(DailyPuzzles)
    .where(eq(DailyPuzzles.date, date));

  return puzzles[0];
}

export async function saveDailyPuzzleScore(puzzleId: string, time: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User must be authenticated");
  }

  await db.insert(DailyPuzzleScores).values({
    userId,
    puzzleId,
    time,
  });
}
