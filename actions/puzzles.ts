"use server";

import { eq, sql } from "drizzle-orm";
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

export async function saveDailyPuzzleScore(puzzleId: number, time: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User must be authenticated");
    }

    await db.insert(DailyPuzzleScores).values({
      userId,
      puzzleId,
      time,
    });

    return { error: false, message: "Daily puzzle score saved" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to save daily puzzle score" };
  }
}

export async function getCompletedPuzzles() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const puzzles = await db
      .select({
        id: DailyPuzzleScores.id,
        puzzleId: DailyPuzzleScores.puzzleId,
        time: DailyPuzzleScores.time,
        date: DailyPuzzles.date,
        createdAt: DailyPuzzleScores.createdAt,
      })
      .from(DailyPuzzleScores)
      .innerJoin(DailyPuzzles, eq(DailyPuzzleScores.puzzleId, DailyPuzzles.id))
      .where(eq(DailyPuzzleScores.userId, userId));

    return puzzles;
  } catch (error) {
    console.error("Detailed error:", error);
    return [];
  }
}

export async function getPuzzleScores(puzzleId: number) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const allScores = await db
      .select()
      .from(DailyPuzzleScores)
      .where(eq(DailyPuzzleScores.puzzleId, puzzleId))
      .orderBy(DailyPuzzleScores.time);

    return {
      topScores: allScores.slice(0, 5),
      userScore: allScores.find((score) => score.userId === userId),
    };
  } catch (error) {
    console.error("Error fetching puzzle scores:", error);
    return { topScores: [], userScore: null };
  }
}
