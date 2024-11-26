"use server";

import { eq } from "drizzle-orm";
import { db } from "@/drizzle";
import { DailyPuzzles, DailyPuzzleScores, Users } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";

export async function getDailyPuzzle(date: string) {
  const puzzles = await db
    .select()
    .from(DailyPuzzles)
    .where(eq(DailyPuzzles.date, date));

  return puzzles[0];
}

export async function saveDailyPuzzleScore(
  puzzleId: number,
  time: number,
  score: number,
  errorCount: number
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("User must be authenticated");
    }

    await db.insert(DailyPuzzleScores).values({
      userId,
      puzzleId,
      time,
      score,
      errorCount,
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
      .select({
        id: DailyPuzzleScores.id,
        userId: DailyPuzzleScores.userId,
        time: DailyPuzzleScores.time,
        score: DailyPuzzleScores.score,
        errorCount: DailyPuzzleScores.errorCount,
        username: Users.username,
      })
      .from(DailyPuzzleScores)
      .innerJoin(Users, eq(DailyPuzzleScores.userId, Users.id))
      .where(eq(DailyPuzzleScores.puzzleId, puzzleId))
      .orderBy(DailyPuzzleScores.time);

    return {
      topScores: allScores.slice(0, 10),
      userScore: allScores.find((score) => score.userId === userId),
    };
  } catch (error) {
    console.error("Error fetching puzzle scores:", error);
    return { topScores: [], userScore: null };
  }
}

export async function getUserById(id: string) {
  const user = await db.select().from(Users).where(eq(Users.id, id));
  return (
    user[0] || {
      id: id,
      username: "",
    }
  );
}

export async function addUser(userId: string, username: string) {
  await db
    .insert(Users)
    .values({
      id: userId,
      username,
    })
    .onConflictDoUpdate({
      target: Users.id,
      set: { username },
    });
}
