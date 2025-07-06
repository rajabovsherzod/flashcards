"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ServerCrash, Home } from "lucide-react";
import { useModal } from "@/store/use-modal-store";
import { useGetStudyCards, useReviewCard } from "@/hooks/use-study";
import { Flashcard } from "./flashcard";

export function StudySessionModal() {
  const { isOpen, type, data, onClose, onOpen } = useModal();
  const { deckId, cardLimit, useRandomOrder } = data;

  const isModalOpen = isOpen && type === "studySession";

  // Ref'lar bilan state'ni boshqarish
  const sessionStartTimeRef = useRef(Date.now());
  const hasShownResultsRef = useRef(false);
  const hasShownLockedInfoRef = useRef(false);
  const reviewsRef = useRef<Array<{ cardId: string; knewIt: boolean }>>([]);

  // Modal function'larni ref'da saqlash
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);

  // Ref'larni yangilash
  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
  }, [onOpen, onClose]);

  const {
    data: studyCardsResponse,
    isLoading,
    isError,
    error,
  } = useGetStudyCards(
    {
      deckId: deckId || "",
      limit: cardLimit || 10,
      randomOrder: useRandomOrder || false,
    },
    isModalOpen && !!deckId
  );

  const { mutate: reviewCard, isPending: isReviewing } = useReviewCard();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const studyCards = studyCardsResponse?.data || [];
  const isSessionComplete =
    studyCards.length > 0 && currentCardIndex >= studyCards.length;

  // Modal yopilganda state'ni tozalash
  const handleClose = useCallback(() => {
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    hasShownResultsRef.current = false;
    hasShownLockedInfoRef.current = false;
    sessionStartTimeRef.current = Date.now();
    reviewsRef.current = [];
    onClose();
  }, [onClose]);

  // Sessiya tugaganda natijalarni ko'rsatish
  useEffect(() => {
    if (
      isSessionComplete &&
      !hasShownResultsRef.current &&
      studyCards.length > 0
    ) {
      hasShownResultsRef.current = true;
      const sessionDuration = Math.round(
        (Date.now() - sessionStartTimeRef.current) / 1000
      );
      const deckTitle = "Study Session";

      // Natijalarni ko'rsatish
      onOpenRef.current("studyResults", {
        studyResult: {
          totalCards: studyCards.length,
          correctAnswers,
          incorrectAnswers,
          studyDuration: sessionDuration,
          deckTitle,
        },
      });

      // Modal'ni yopish
      onCloseRef.current();
    }
  }, [isSessionComplete, studyCards.length, correctAnswers, incorrectAnswers]);

  // Agar kartochkalar bo'lmasa, LockedInfoModal'ni ochish
  useEffect(() => {
    if (
      studyCards.length === 0 &&
      !isLoading &&
      !isError &&
      isModalOpen &&
      deckId &&
      !hasShownLockedInfoRef.current
    ) {
      hasShownLockedInfoRef.current = true;
      onOpenRef.current("lockedInfo", {
        deckId: deckId,
        cardLimit: cardLimit,
        useRandomOrder: useRandomOrder,
      });
      onCloseRef.current();
    }
  }, [
    studyCards.length,
    isLoading,
    isError,
    isModalOpen,
    deckId,
    cardLimit,
    useRandomOrder,
  ]);

  const handleCardReview = useCallback(
    (cardId: string, knewIt: boolean) => {
      console.log("Reviewing card:", cardId, "knewIt:", knewIt);

      // Review'ni saqlash
      reviewsRef.current.push({ cardId, knewIt });

      // Natijalarni kuzatish
      if (knewIt) {
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setIncorrectAnswers((prev) => prev + 1);
      }

      // Backend'ga review yuborish (individual)
      reviewCard(
        { cardId, payload: { knewIt } },
        {
          onSuccess: () => {
            console.log("Review successful, moving to next card");
            setCurrentCardIndex((prev) => prev + 1);
          },
          onError: (error) => {
            console.error("Review failed:", error);
            // Xatolik bo'lsa ham keyingi kartochkaga o'tish
            setCurrentCardIndex((prev) => prev + 1);
          },
        }
      );
    },
    [reviewCard]
  );

  let content = null;

  if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading study session...</p>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ServerCrash className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold text-destructive">
          Failed to load session
        </h3>
        <p className="text-muted-foreground mt-2">
          Could not fetch cards for this deck. Please try again.
        </p>
        {error && (
          <p className="text-xs text-muted-foreground mt-2">
            Error: {error.message}
          </p>
        )}
      </div>
    );
  } else if (studyCards.length > 0 && currentCardIndex < studyCards.length) {
    const currentCard = studyCards[currentCardIndex];
    content = (
      <Flashcard
        key={`${currentCard.id}-${currentCardIndex}`}
        card={currentCard}
        onReview={handleCardReview}
        isLoading={isReviewing}
        cardNumber={currentCardIndex + 1}
        totalCards={studyCards.length}
      />
    );
  } else if (studyCards.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold text-foreground">
          No Cards to Study
        </h3>
        <p className="text-muted-foreground mt-2">
          There are no cards currently available for review in this deck.
        </p>
      </div>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl flex flex-col min-h-[60vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Study Session</span>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <Home className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
