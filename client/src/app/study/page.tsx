"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetStudyCards, useReviewCard } from "@/hooks/use-study";
import { useGetDeck } from "@/hooks/use-get-deck";
import { useGetAllDecks } from "@/hooks/use-get-all-deck";
import { Flashcard } from "@/components/study/flashcard";
import { Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/lib/api/cards/card.types";

function StudyResults({
  totalCards,
  correctAnswers,
  incorrectAnswers,
  studyDuration,
  deckTitle,
  onBack,
  onRestart,
}: {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  studyDuration: number;
  deckTitle: string;
  onBack: () => void;
  onRestart: () => void;
}) {
  const accuracy =
    totalCards > 0 ? Math.round((correctAnswers / totalCards) * 100) : 0;
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-card rounded-xl border border-border shadow-lg text-center">
      <h2 className="text-3xl font-bold mb-2">Study Results</h2>
      <p className="text-lg text-muted-foreground mb-6">{deckTitle}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-2xl font-bold">{totalCards}</div>
          <div className="text-sm text-muted-foreground">Total Cards</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-2xl font-bold">
            {formatDuration(studyDuration)}
          </div>
          <div className="text-sm text-muted-foreground">Duration</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xl font-bold text-green-600">
            {correctAnswers}
          </div>
          <div className="text-sm text-green-600">Correct</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-xl font-bold text-red-600">
            {incorrectAnswers}
          </div>
          <div className="text-sm text-red-600">Incorrect</div>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Accuracy</span>
          <span className="text-lg font-bold">{accuracy}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>
      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <Home className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Button onClick={onRestart} className="flex-1">
          Study Again
        </Button>
      </div>
    </div>
  );
}

function StudySession({
  cards,
  deckTitle,
  onComplete,
}: {
  cards: Card[];
  deckTitle: string;
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">No Cards to Study</h2>
        <p className="text-muted-foreground">
          There are no cards available for review in this deck.
        </p>
      </div>
    );
  }

  const handleReview = (cardId: string, knewIt: boolean) => {
    reviewCard({ cardId, payload: { knewIt } });
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
    <div className="max-w-xl mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">{deckTitle}</h2>
      <Flashcard
        key={`${cards[current].id}-${current}`}
        card={cards[current]}
        onReview={handleReview}
        isLoading={isPending}
        cardNumber={current + 1}
        totalCards={cards.length}
      />
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
  const [sessionKey, setSessionKey] = useState(0); // for restarting

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
    !!deckId
  );
  const studyCards = studyCardsResponse?.data || [];

  // Deck selection UI
  if (!deckId) {
    return (
      <div className="max-w-xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-4">Choose a Deck to Study</h2>
        {decksLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : decks.length === 0 ? (
          <div className="text-muted-foreground">
            No decks found. Create a deck to start studying.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map((d) => (
              <Button
                key={d.id}
                className="w-full h-20 text-lg font-semibold"
                onClick={() => {
                  router.push(`/study?deckId=${d.id}`);
                }}
              >
                {d.title}{" "}
                <span className="ml-2 text-muted-foreground">
                  ({d.cardCount} cards)
                </span>
              </Button>
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
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading study session...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h3 className="text-xl font-semibold text-destructive mb-2">
          Failed to load session
        </h3>
        <p className="text-muted-foreground mb-2">
          Could not fetch cards for this deck. Please try again.
        </p>
        {error && (
          <p className="text-xs text-muted-foreground">
            Error: {error.message}
          </p>
        )}
        <Button className="mt-4" onClick={() => router.push("/study")}>
          Back to Deck Selection
        </Button>
      </div>
    );
  }

  // Show results
  if (showResults && result && deck) {
    return (
      <StudyResults
        totalCards={studyCards.length}
        correctAnswers={result.correct}
        incorrectAnswers={result.incorrect}
        studyDuration={result.duration}
        deckTitle={deck.title}
        onBack={() => router.push("/dashboard")}
        onRestart={() => {
          setShowResults(false);
          setResult(null);
          setSessionKey((k) => k + 1);
        }}
      />
    );
  }

  // Study session
  return (
    <StudySession
      key={sessionKey}
      cards={studyCards}
      deckTitle={deck?.title || "Study Session"}
      onComplete={(r) => {
        setResult(r);
        setShowResults(true);
      }}
    />
  );
}
