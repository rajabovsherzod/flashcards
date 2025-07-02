"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { useStageDistribution } from "@/hooks/use-statistics";

export const StageDistributionChart = () => {
  const { data, isLoading } = useStageDistribution();
  
  const chartData = data?.data || [];
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  const stageColors = [
    { color: "hsl(var(--teal-300))", bg: "bg-teal-300", name: "New" },
    { color: "hsl(var(--teal-400))", bg: "bg-teal-400", name: "Learning" },
    { color: "hsl(var(--teal-500))", bg: "bg-teal-500", name: "Young" },
    { color: "hsl(var(--teal-600))", bg: "bg-teal-600", name: "Mature" },
    { color: "hsl(var(--teal-700))", bg: "bg-teal-700", name: "Review" },
    { color: "hsl(var(--teal-800))", bg: "bg-teal-800", name: "Mastered" },
    { color: "hsl(var(--teal-900))", bg: "bg-teal-900", name: "Expert" },
  ];

  const formattedChartData = stageColors.map((color, index) => {
    const stageData = chartData.find(item => item.stage === index + 1) || { count: 0 };
    return {
      stage: index + 1,
      count: stageData.count,
      percentage: total > 0 ? Math.round((stageData.count / total) * 100) : 0,
      color: color
    };
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-40 bg-muted rounded" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-muted rounded-full" />
                  <div className="h-3 bg-muted rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // if (total === 0) {
  //   return (
  //     <Card>
  //       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  //         <CardTitle className="text-base font-semibold">
  //           Stage Distribution
  //         </CardTitle>
  //         <PieChart className="h-4 w-4 text-muted-foreground" />
  //       </CardHeader>
  //       <CardContent>
  //         <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
  //           <BarChart3 className="h-8 w-8 mb-2" />
  //           <p className="text-sm">No cards to analyze</p>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Stage Distribution
        </CardTitle>
        <PieChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple Donut Chart */}
          <div className="relative mx-auto w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-muted to-muted/50" />
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-xs text-muted-foreground">Total Cards</div>
              </div>
            </div>
            {/* Donut segments */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {formattedChartData.map((item, index) => {
                const angle = (item.count / total) * 360;
                const rotation = formattedChartData
                  .slice(0, index)
                  .reduce((sum, prev) => sum + (prev.count / total) * 360, 0);

                return (
                  <div
                    key={item.stage}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from ${rotation}deg, ${item.color.color} 0deg, ${item.color.color} ${angle}deg, transparent ${angle}deg)`,
                      maskImage: "radial-gradient(circle, transparent 30%, black 30%)",
                      WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 30%)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {formattedChartData.map((item) => (
              <div
                key={item.stage}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color.bg}`} />
                  <span>Stage {item.stage}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span>{item.count} cards</span>
                  <span className="font-medium">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Info */}
          <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800/30">
            <div className="text-xs text-muted-foreground mb-2">
              Stage Meanings:
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>
                Stage 1-2:{" "}
                <span className="text-teal-800 font-medium">New</span>
              </div>
              <div>
                Stage 3-4:{" "}
                <span className="text-teal-800 font-medium">Learning</span>
              </div>
              <div>
                Stage 5-6:{" "}
                <span className="text-teal-800 font-medium">Young</span>
              </div>
              <div>
                Stage 7+:{" "}
                <span className="text-teal-800 font-medium">Mature</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};