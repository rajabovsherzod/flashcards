"use client";

import { StatisticsOverview } from "@/components/dashboard/statistics-overview";
import { StageDistributionChart } from "@/components/dashboard/stage-distribution-chart";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { useAuthStore } from "@/store/auth-store";
import { Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateDeckModal } from "@/hooks/use-create-deck-modal";
import { CreateDeckModal } from "@/components/decks/create-deck-modal";
import { CreateCardModal } from "@/components/cards/create-card-modal";
import { ProtectedPage } from "@/app/auth/protected-page";
import Link from "next/link";

export default function DashboardPage() {
  const { fullName } = useAuthStore();
  const { onOpen } = useCreateDeckModal();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const motivationalMessages = [
    "Every card you master is a step closer to your goals! 🎯",
    "Consistency beats perfection. Keep going! 💪",
    "Your future self will thank you for studying today! ✨",
    "Small progress daily leads to big results yearly! 🚀",
    "Knowledge is power, and you're building yours! 🧠",
  ];

  const todaysMessage =
    motivationalMessages[new Date().getDay() % motivationalMessages.length];

  return (
    <ProtectedPage requireAuth={true}>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Motivational Hero Section */}
        <section className="mb-8">
          <div className="relative bg-card dark:bg-card rounded-xl border border-border p-6">
            {/* Content */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {getGreeting()}, {fullName || "Learner"}! 👋
                </h1>
                <p className="text-muted-foreground font-medium">
                  Ready to expand your knowledge today?
                </p>
              </div>
            </div>

            <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-4 border border-teal-200 dark:border-teal-800/40">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                  Daily Motivation
                </span>
              </div>
              <p className="text-teal-800 dark:text-teal-200 font-medium">
                {todaysMessage}
              </p>
            </div>
          </div>
        </section>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Your Learning Analytics
          </h2>
          <p className="text-muted-foreground mt-2">
            Track your progress and flashcard statistics
          </p>
        </div>

        {/* Statistics Overview Cards */}
        <section className="mb-8">
          <StatisticsOverview />
        </section>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Stage Distribution */}
          <StageDistributionChart />

          {/* Performance Chart */}
          <PerformanceChart />
        </div>

        {/* Activity Heatmap - Full Width */}
        <section className="mb-8">
          <ActivityHeatmap />
        </section>

        {/* Quick Actions */}
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800/30">
            <h3 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">
              Continue Learning
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Resume your study session where you left off
            </p>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors">
              Start Studying
            </Button>
          </div>

          <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800/30">
            <h3 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">
              Create New Deck
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new collection of flashcards
            </p>
            <Button
              onClick={onOpen}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
            >
              Create Deck
            </Button>
          </div>

          <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800/30 md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">
              View All Decks
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your flashcard collections
            </p>
            <Link href="/decks">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors">
                Browse Decks
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <CreateDeckModal />
      <CreateCardModal />
    </div>
    </ProtectedPage>
  );
}
