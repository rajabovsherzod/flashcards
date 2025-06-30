import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import React from "react";

const StatsUIMockup = () => {
  // Mock data
  const weeklyCorrectPercentage = 78;
  const correctCount = 102;
  const incorrectCount = 29;
  const heatmapData = [2, 1, 3, 0, 4, 2, 1, 3, 2, 0, 1, 3, 2, 1];
  const stageData = [
    { label: "New", count: 32, color: "bg-gray-400" },
    { label: "Learning", count: 58, color: "bg-blue-500" },
    { label: "Reviewing", count: 112, color: "bg-teal-500" },
    { label: "Mastered", count: 89, color: "bg-green-500" },
    { label: "Leech", count: 8, color: "bg-red-500" },
  ];

  const getColor = (value: number) => {
    if (value === 0) return "bg-muted/50";
    if (value === 1) return "bg-primary/20";
    if (value === 2) return "bg-primary/50";
    if (value === 3) return "bg-primary/80";
    return "bg-primary";
  };

  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col p-4 pt-6 select-none overflow-y-auto space-y-6">
      {/* Top Stats Section */}
      <div className="flex gap-4">
        {/* Weekly Performance */}
        <div className="w-1/2 flex flex-col items-center gap-3 p-3 rounded-lg bg-muted/50">
          <h3 className="text-xs font-semibold text-muted-foreground">
            Last 7 Days
          </h3>
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(closest-side, var(--background) 79%, transparent 80% 100%), conic-gradient(var(--primary) ${weeklyCorrectPercentage}%, var(--muted) 0)`,
            }}
          >
            <span className="text-lg font-bold text-foreground">
              {weeklyCorrectPercentage}%
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="w-3 h-3" />
              <span>{correctCount}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <XCircle className="w-3 h-3" />
              <span>{incorrectCount}</span>
            </div>
          </div>
        </div>
        {/* SRS Stages */}
        <div className="w-1/2 flex flex-col gap-2 p-3 rounded-lg bg-muted/50">
          <h3 className="text-xs font-semibold text-muted-foreground mb-1">
            SRS Stages
          </h3>
          <ul className="space-y-1.5 text-xs">
            {stageData.map((stage) => (
              <li
                key={stage.label}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${stage.color}`}
                  ></span>
                  {stage.label}
                </span>
                <span className="font-semibold">{stage.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Daily Activity
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.map((value, index) => (
            <div
              key={index}
              className={`w-full aspect-square rounded-sm ${getColor(value)}`}
            />
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground italic">
          &quot;The secret of getting ahead is getting started.&quot;
        </p>
      </div>
    </div>
  );
};

export default StatsUIMockup;
