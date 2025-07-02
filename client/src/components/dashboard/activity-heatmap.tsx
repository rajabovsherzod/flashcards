"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flame } from "lucide-react";
import { useHeadmapData } from "@/hooks/use-statistics";

export const ActivityHeatmap = () => {
  const { data, isLoading } = useHeadmapData();
  
  // Backend'dan kelgan data yoki bo'sh massiv
  const heatmapData = data?.data || [];

  // Create a map for easy lookup
  const dataMap = new Map(heatmapData.map((item) => [item.date, item.count]));

  // Get activity level based on count - using teal colors for intensity
  const getActivityLevel = (count: number) => {
    if (count === 0)
      return { level: 0, color: "bg-muted/20", intensity: "No activity" };
    if (count <= 3)
      return {
        level: 1,
        color: "bg-teal-200 dark:bg-teal-900/40",
        intensity: "Low activity",
      };
    if (count <= 6)
      return {
        level: 2,
        color: "bg-teal-400 dark:bg-teal-800/60",
        intensity: "Moderate activity",
      };
    if (count <= 10)
      return {
        level: 3,
        color: "bg-teal-600 dark:bg-teal-700/80",
        intensity: "High activity",
      };
    return {
      level: 4,
      color: "bg-teal-800 dark:bg-teal-600",
      intensity: "Very high activity",
    };
  };

  // Calculate statistics
  const totalActivity = heatmapData.reduce((sum, item) => sum + item.count, 0);
  const activeDays = heatmapData.length; // Backend faqat active kunlarni yuboradi
  const streak = calculateStreak(heatmapData);
  const maxDaily = Math.max(...heatmapData.map((item) => item.count), 0);

  // Calculate current streak
  function calculateStreak(data: typeof heatmapData): number {
    if (data.length === 0) return 0;
  
    const sortedDates = [...data]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(item => item.date);
  
    const today = new Date().toISOString().split("T")[0];
    if (sortedDates[0] !== today) return 0;
  
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split("T")[0];
      
      if (sortedDates[i] === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }
  
    return streak;
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-53 gap-1">
              {[...Array(371)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-muted rounded"></div>
              ))}
            </div>
            <div className="flex justify-between">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded w-16"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Activity Heatmap
        </CardTitle>
        <Calendar className="ml-auto h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">
                {totalActivity}
              </div>
              <div className="text-xs text-muted-foreground">Total Reviews</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{activeDays}</div>
              <div className="text-xs text-muted-foreground">Active Days</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-xs text-muted-foreground">
                Current Streak
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{maxDaily}</div>
              <div className="text-xs text-muted-foreground">Max Daily</div>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-2">
            {/* Month labels */}
            <div className="flex text-xs text-muted-foreground mb-1">
              <div className="w-8"></div>
              {[
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ].map((month) => (
                <div key={month} className="flex-1 text-center">
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col text-xs text-muted-foreground mr-2 justify-around">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-53 gap-[2px] flex-1">
                {Array.from({ length: 371 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (370 - i));
                  const dateStr = date.toISOString().split("T")[0];
                  const count = dataMap.get(dateStr) || 0;
                  const activity = getActivityLevel(count);

                  return (
                    <div
                      key={dateStr}
                      className={`w-3 h-3 rounded-sm ${activity.color} cursor-pointer hover:ring-2 hover:ring-teal-500/50 transition-all`}
                      title={`${dateStr}: ${count} reviews - ${activity.intensity}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-sm bg-muted/20"></div>
              <div className="w-3 h-3 rounded-sm bg-teal-200"></div>
              <div className="w-3 h-3 rounded-sm bg-teal-400"></div>
              <div className="w-3 h-3 rounded-sm bg-teal-600"></div>
              <div className="w-3 h-3 rounded-sm bg-teal-800"></div>
            </div>
            <span>More</span>
          </div>

          {/* Streak indicator */}
          {streak > 0 && (
            <div className="flex items-center justify-center space-x-2 p-2 bg-teal-100 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800/30">
              <Flame className="h-4 w-4 text-teal-600" />
              <span className="text-sm text-teal-600 font-medium">
                {streak} day streak! Keep it up! 🔥
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};