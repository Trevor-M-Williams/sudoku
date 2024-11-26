import { CalendarIcon } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { TopScore } from "@/lib/types";

export function TopScores({
  topScores,
  userScore,
  setTopScores,
}: {
  topScores: TopScore[];
  userScore: TopScore | null;
  setTopScores: (topScores: TopScore[]) => void;
}) {
  return (
    <div className="w-full max-w-[400px]">
      <CalendarIcon
        className="absolute top-[1.1rem] right-10 size-[0.8rem] cursor-pointer text-gray-600 hover:text-black"
        onClick={() => setTopScores([])}
      />
      <table className="w-full">
        <thead>
          <tr className="text-sm text-gray-500">
            <th className="text-left w-10">#</th>
            <th className="text-left">Player</th>
            <th className="text-right">Time</th>
            <th className="text-right">Score</th>
            <th className="text-right">Errors</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((score, index) => {
            const isUser = score.userId === userScore?.userId;
            return (
              <tr key={score.id} className={cn(isUser ? "bg-blue-100" : "")}>
                <td className="py-1 font-medium">{index + 1}.</td>
                <td>{score.username.slice(0, 15)}</td>
                <td className="text-right">{formatTime(score.time)}</td>
                <td className="text-right">{score.score}</td>
                <td className="text-right">{score.errorCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
