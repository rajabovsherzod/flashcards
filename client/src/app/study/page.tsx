"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetStudyCards, useReviewCard } from "@/hooks/use-study";
import { useGetDeck } from "@/hooks/use-get-deck";
import { useGetAllDecks } from "@/hooks/use-get-all-deck";
import { Flashcard } from "@/components/study/flashcard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/lib/api/cards/card.types";
import { useQueryClient } from "@tanstack/react-query";

function StudyResults({
  totalCards,
  correctAnswers,
  incorrectAnswers,
  studyDuration,
  deckTitle,
  deckId,
}: {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  studyDuration: number;
  deckTitle: string;
  deckId?: string;
}) {
  const accuracy =
    totalCards > 0 ? Math.round((correctAnswers / totalCards) * 100) : 0;
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  const queryClient = useQueryClient();
  const router = useRouter();

  // useEffectni olib tashladim, querylarni faqat handleBackda tozalayman
  const handleBack = () => {
    queryClient.removeQueries({ queryKey: ["study-cards"], exact: false });
    queryClient.removeQueries({ queryKey: ["decks"] });
    queryClient.removeQueries({ queryKey: ["statistics"] });
    if (deckId) {
      queryClient.removeQueries({ queryKey: ["deck", deckId] });
    }
    router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-8 mx-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-foreground text-center">
          Study Results
        </h2>
        <p className="text-base text-muted-foreground mb-6 text-center">
          {deckTitle}
        </p>
        <div className="w-full flex justify-between mb-4">
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg font-semibold text-foreground">
              {totalCards}
            </span>
            <span className="text-xs text-muted-foreground">Cards</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg font-semibold text-foreground">
              {formatDuration(studyDuration)}
            </span>
            <span className="text-xs text-muted-foreground">Duration</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-lg font-semibold text-foreground">
              {accuracy}%
            </span>
            <span className="text-xs text-muted-foreground">Accuracy</span>
          </div>
        </div>
        <div className="w-full flex justify-between mb-6">
          <div className="flex flex-col items-center flex-1">
            <span className="text-base font-medium text-foreground">
              {correctAnswers}
            </span>
            <span className="text-xs text-muted-foreground">Correct</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-base font-medium text-foreground">
              {incorrectAnswers}
            </span>
            <span className="text-xs text-muted-foreground">Incorrect</span>
          </div>
        </div>
        <div className="w-full mb-4">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {accuracy >= 90 && "Excellent! You're mastering this material!"}
            {accuracy >= 80 &&
              accuracy < 90 &&
              "Great job! You're doing very well!"}
            {accuracy >= 70 && accuracy < 80 && "Good work! Keep practicing!"}
            {accuracy >= 60 &&
              accuracy < 70 &&
              "Not bad! A bit more practice needed."}
            {accuracy < 60 && "Keep studying! You'll improve with practice."}
          </p>
        </div>
        <div className="w-full mb-6">
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex flex-col items-center flex-1">
              <span className="font-semibold text-foreground">
                {formatDuration(Math.round(studyDuration / totalCards))}
              </span>
              <span>Avg/card</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-semibold text-foreground">
                {Math.round((totalCards / studyDuration) * 60)}
              </span>
              <span>Cards/min</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-semibold text-foreground">{accuracy}%</span>
              <span>Success</span>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full h-12 text-base font-medium border-2 hover:bg-secondary mt-2"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

function StudySession({
  cards,
  deckTitle,
  deckId,
  onComplete,
}: {
  cards: Card[];
  deckTitle: string;
  deckId: string;
  onComplete: (result: {
    correct: number;
    incorrect: number;
    duration: number;
  }) => void;
}) {
  const { mutate: reviewCard, isPending } = useReviewCard();
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [startTime] = useState(Date.now());

  if (!cards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-md mx-auto p-8 bg-card rounded-xl border border-border shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            No Cards to Study
          </h2>
          <p className="text-muted-foreground">
            There are no cards available for review in this deck.
          </p>
        </div>
      </div>
    );
  }

  const handleReview = (cardId: string, knewIt: boolean) => {
    reviewCard({ cardId, payload: { knewIt }, deckId });
    if (knewIt) setCorrect((c) => c + 1);
    else setIncorrect((i) => i + 1);
    if (current + 1 >= cards.length) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      onComplete({
        correct: knewIt ? correct + 1 : correct,
        incorrect: knewIt ? incorrect : incorrect + 1,
        duration,
      });
    } else {
      setCurrent((c) => c + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {deckTitle}
        </h2>
        <p className="text-lg text-muted-foreground">
          Study Session in Progress
        </p>
      </div>

      <div className="flex justify-center">
        <Flashcard
          key={`${cards[current].id}-${current}`}
          card={cards[current]}
          onReview={handleReview}
          isLoading={isPending}
          cardNumber={current + 1}
          totalCards={cards.length}
        />
      </div>
    </div>
  );
}

export default function StudyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = searchParams.get("deckId");
  const limit = searchParams.get("limit");
  const random = searchParams.get("random");

  // Deck selection
  const { data: decksData, isLoading: decksLoading } = useGetAllDecks();
  const decks = decksData?.data || [];

  // Study session
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{
    correct: number;
    incorrect: number;
    duration: number;
  } | null>(null);

  // Deck info
  const { data: deckData } = useGetDeck(deckId || "", !!deckId);
  const deck = deckData?.data;

  const {
    data: studyCardsResponse,
    isLoading: cardsLoading,
    isError,
    error,
  } = useGetStudyCards(
    {
      deckId: deckId || "",
      limit: limit ? parseInt(limit) : 10,
      randomOrder: random === "true",
    },
    !!deckId && !showResults
  );
  const studyCards = studyCardsResponse?.data || [];

  // Deck selection UI
  if (!deckId) {
    return (
      <div className="max-w-4xl mx-auto mt-16 px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Choose a Deck to Study
          </h2>
          <p className="text-lg text-muted-foreground">
            Select a deck to start your study session
          </p>
        </div>

        {decksLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your decks...</p>
            </div>
          </div>
        ) : decks.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 bg-card rounded-xl border border-border shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Decks Found
            </h3>
            <p className="text-muted-foreground mb-4">
              You haven&apos;t created any decks yet. Create one to start
              studying.
            </p>
            <Button
              onClick={() => router.push("/decks")}
              className="bg-primary hover:bg-primary/90"
            >
              Create Your First Deck
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((d) => (
              <div
                key={d.id}
                className="group relative p-6 bg-card rounded-xl border border-border hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => {
                  router.push(`/study?deckId=${d.id}`);
                }}
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {d.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">
                      {d.cardCount} {d.cardCount === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Loading/error UI
  if (cardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Loading study session...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Preparing your cards for review
          </p>
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-md mx-auto p-8 bg-card rounded-xl border border-border shadow-lg">
          <h3 className="text-xl font-semibold text-destructive mb-4">
            Failed to load session
          </h3>
          <p className="text-muted-foreground mb-4">
            Could not fetch cards for this deck. Please try again.
          </p>
          {error && (
            <p className="text-xs text-muted-foreground mb-6 bg-secondary/50 p-3 rounded-lg">
              Error: {error.message}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/study")}
              className="flex-1"
            >
              Back to Deck Selection
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && result && deck) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <StudyResults
          totalCards={result.correct + result.incorrect}
          correctAnswers={result.correct}
          incorrectAnswers={result.incorrect}
          studyDuration={result.duration}
          deckTitle={deck.title}
          deckId={deck?.id || ""}
        />
      </div>
    );
  }

  // Study session
  if (!showResults) {
    return (
      <StudySession
        cards={studyCards}
        deckTitle={deck?.title || "Study Session"}
        deckId={deck?.id || ""}
        onComplete={(r) => {
          setResult(r);
          setShowResults(true);
        }}
      />
    );
  }

  // Default fallback (should never reach here)
  return null;
}
