// components/dashboard/statistics-overview.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CreditCard, Brain, Target } from "lucide-react";
import { useDashboardSummary } from "@/hooks/use-statistics";
import { GetDashBoardSummarResponse } from "@/lib/api/statistics/statistics.types";

export const StatisticsOverview = () => {
  const { data } = useDashboardSummary();

  const summary: GetDashBoardSummarResponse = data?.data || {
    totalDecks: 0,
    totalCards: 0,
    matureCards: 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Decks Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Decks
          </CardTitle>
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20">
            <BookOpen className="h-4 w-4 text-teal-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalDecks}</div>
          <p className="text-xs text-muted-foreground mt-1">Active decks</p>
        </CardContent>
      </Card>

      {/* Total Cards Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Cards
          </CardTitle>
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20">
            <CreditCard className="h-4 w-4 text-teal-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalCards}</div>
          <p className="text-xs text-muted-foreground mt-1">All flashcards</p>
        </CardContent>
      </Card>

      {/* Mature Cards Card */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Mature Cards
          </CardTitle>
          <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20">
            <Brain className="h-4 w-4 text-teal-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.matureCards}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Well-learned cards
          </p>
        </CardContent>
      </Card>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Learning progress
                </CardTitle>
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/20">
                  <Target className="h-4 w-4 text-teal-800" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.totalCards > 0
              ? Math.round((summary.matureCards / summary.totalCards) * 100)
              : 0}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Learning progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
