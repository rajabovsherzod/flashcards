"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, CheckCircle, XCircle } from "lucide-react";
import { usePerformance } from "@/hooks/use-statistics";
import { useState } from "react";

export const PerformanceChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const { data, isLoading } = usePerformance({ period: selectedPeriod });

  // Default data - hamma qiymatlar 0
  const defaultData = {
    totalReviews: 0,
    correctReviews: 0,
    incorrectReviews: 0,
    accuracy: 0
  };

  // Data kelgan/kelmagan holatlar uchun stats
  const stats = data?.data ? {
    totalReviews: data.data.totalReviews,
    correctReviews: data.data.correctReviews,
    incorrectReviews: data.data.totalReviews - data.data.correctReviews,
    accuracy: data.data.totalReviews > 0 
      ? Math.round((data.data.correctReviews / data.data.totalReviews) * 100) 
      : 0
  } : defaultData;

  // Circular progress calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (stats.accuracy / 100) * circumference;

  // Performance level based on accuracy
  const getPerformanceLevel = (acc: number) => {
    if (acc >= 90) return {
      level: "Excellent",
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
    };
    if (acc >= 80) return {
      level: "Good",
      color: "text-teal-500",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
    };
    if (acc >= 70) return {
      level: "Fair",
      color: "text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
    };
    if (acc >= 60) return {
      level: "Needs Work",
      color: "text-teal-300",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
    };
    return {
      level: "Poor",
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    };
  };

  const performance = getPerformanceLevel(stats.accuracy);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="mx-auto w-32 h-32 bg-muted rounded-full"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
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
          Performance ({selectedPeriod === 1 ? 'Today' : `${selectedPeriod} days`})
        </CardTitle>
        <TrendingUp className="ml-auto h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Circular Progress */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Background circle */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted stroke-current opacity-20"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={`${performance.color} stroke-current transition-all duration-1000 ease-out`}
                  style={{
                    strokeDasharray,
                    strokeDashoffset,
                  }}
                />
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.accuracy}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Level Badge */}
          <div className="flex justify-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${performance.bgColor} ${performance.color}`}>
              {performance.level}
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                <span>Correct Reviews</span>
              </div>
              <span className="font-medium text-teal-500">
                {stats.correctReviews}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Incorrect Reviews</span>
              </div>
              <span className="font-medium text-red-500">
                {stats.incorrectReviews}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm border-t pt-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>Total Reviews</span>
              </div>
              <span className="font-medium">{stats.totalReviews}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Daily Average</span>
              <span>{Math.round(stats.totalReviews / selectedPeriod)} reviews/day</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${performance.color.replace(
                  "text-",
                  "bg-"
                )} transition-all duration-1000 ease-out`}
                style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
              />
            </div>
          </div>

          {/* Period Buttons */}
          <div className="flex justify-between gap-2">
            <button
              onClick={() => setSelectedPeriod(1)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedPeriod === 1 
                  ? 'bg-teal-600 text-white dark:bg-teal-600 dark:text-white'
                  : 'hover:bg-muted'
                }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedPeriod(7)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedPeriod === 7 
                  ? 'bg-teal-600 text-white dark:bg-teal-600 dark:text-white'
                  : 'hover:bg-muted'
                }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedPeriod(10)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedPeriod === 10 
                  ? 'bg-teal-600 text-white dark:bg-teal-600 dark:text-white'
                  : 'hover:bg-muted'
                }`}
            >
              10 Days
            </button>
            <button
              onClick={() => setSelectedPeriod(30)}
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedPeriod === 30 
                  ? 'bg-teal-600 text-white dark:bg-teal-600 dark:text-white'
                  : 'hover:bg-muted'
                }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};