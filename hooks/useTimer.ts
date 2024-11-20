import { useState, useEffect } from "react";
import { GameStatus } from "@/lib/types";

export function useTimer(gameStatus: GameStatus) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameStatus === "playing") {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStatus]);

  const resetTimer = () => setElapsedTime(0);
  const setTime = (time: number) => setElapsedTime(time);

  return {
    elapsedTime,
    resetTimer,
    setTime,
  };
}
