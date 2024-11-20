import { useState, useEffect } from "react";
import { SudokuCell, Difficulty } from "@/lib/types";
import { GameStatus } from "@/lib/types";

interface SavedGameState {
  board: SudokuCell[][];
  solution: number[][];
  gameStatus: GameStatus;
  difficulty: Difficulty;
  elapsedTime: number;
  selectedValue: number | null;
}

export function useSavedGame() {
  const [savedGame, setSavedGame] = useState<SavedGameState | null>(null);

  useEffect(() => {
    const savedGameData = localStorage.getItem("sudokuGameState");
    if (savedGameData) {
      const parsedGame: SavedGameState = JSON.parse(savedGameData);
      setSavedGame(parsedGame);
    }
  }, []);

  const updateSavedGame = (gameState: SavedGameState) => {
    if (!gameState) return;

    if (gameState.gameStatus === "playing") {
      const gameStateToSave: SavedGameState = {
        board: gameState.board,
        solution: gameState.solution,
        gameStatus: gameState.gameStatus,
        difficulty: gameState.difficulty,
        elapsedTime: gameState.elapsedTime,
        selectedValue: gameState.selectedValue,
      };
      localStorage.setItem("sudokuGameState", JSON.stringify(gameStateToSave));
      setSavedGame(gameStateToSave);
    } else if (gameState.gameStatus === "complete") {
      localStorage.removeItem("sudokuGameState");
      setSavedGame(null);
    }
  };

  return {
    savedGame,
    updateSavedGame,
  };
}
