import "@/drizzle/envConfig";
import { db } from "@/drizzle";
import { DailyPuzzles } from "@/drizzle/schema";
import { Difficulty } from "@/lib/types";
import { generatePuzzle } from "@/lib/sudoku";

const weeklyPattern: Difficulty[] = [
  "Expert", // Sunday
  "Easy", // Monday
  "Medium", // Tuesday
  "Medium", // Wednesday
  "Hard", // Thursday
  "Hard", // Friday
  "Expert", // Saturday
];

function getDifficultyForDate(date: Date): Difficulty {
  const dayOfWeek = date.getUTCDay();

  return weeklyPattern[dayOfWeek];
}

function generatePuzzleForDate(date: Date) {
  const difficulty = getDifficultyForDate(date);
  const { boardString, solutionString } = generatePuzzle(difficulty);

  const formattedDate = date.toISOString().split("T")[0];

  const puzzle = {
    date: formattedDate,
    difficulty,
    board: boardString,
    solution: solutionString,
  };

  return puzzle;
}

async function generateDailyPuzzles() {
  try {
    const startDate = new Date("2024-1-1");
    const endDate = new Date("2024-12-31");

    const puzzles = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      puzzles.push(generatePuzzleForDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    await db.insert(DailyPuzzles).values(puzzles);

    console.log(
      `Successfully generated ${
        puzzles.length
      } puzzles from ${startDate.toISOString()} to ${endDate.toISOString()}`
    );
  } catch (error) {
    console.error("Error generating daily puzzles:", error);
    throw error;
  }
}

// Run the script
console.time("generateDailyPuzzles");
generateDailyPuzzles();
console.timeEnd("generateDailyPuzzles");
