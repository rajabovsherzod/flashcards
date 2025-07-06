"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Card as CardType } from "@/lib/api/cards/card.types";

interface FlashcardProps {
  card: CardType;
  onReview: (cardId: string, knewIt: boolean) => void;
  isLoading: boolean;
  cardNumber: number;
  totalCards: number;
}

export function Flashcard({
  card,
  onReview,
  isLoading,
  cardNumber,
  totalCards,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleCardFlip = useCallback(() => {
    if (!isLoading && !isTransitioning) {
      setIsFlipped(!isFlipped);
    }
  }, [isLoading, isTransitioning, isFlipped]);

  const handleReviewClick = useCallback(
    (knewIt: boolean) => {
      // Prevent multiple clicks while transitioning
      if (isLoading || isTransitioning) return;

      setIsTransitioning(true);

      // 1. Start the flip-back animation
      setIsFlipped(false);

      // 2. After the flip animation is past the halfway point (back is hidden),
      //    tell the parent component to move to the next card.
      setTimeout(() => {
        onReview(card.id, knewIt);
        setIsTransitioning(false);
      }, 300); // The animation is 0.6s, so 0.3s is the perfect time.
    },
    [isLoading, isTransitioning, card.id, onReview]
  );

  const cardVariants = {
    initial: { rotateY: 0 },
    flipped: { rotateY: 180 },
  };

  const progressBarWidth = totalCards > 0 ? (cardNumber / totalCards) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full px-4 mb-6">
        <div className="w-full bg-secondary rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: `${((cardNumber - 1) / totalCards) * 100}%` }}
            animate={{ width: `${progressBarWidth}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Card {cardNumber} of {totalCards}
        </p>
      </div>

      {/* Flippable Card */}
      <div
        className="w-full max-w-xl h-72 perspective-[1000px] cursor-pointer"
        onClick={handleCardFlip}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial="initial"
          animate={isFlipped ? "flipped" : "initial"}
          variants={cardVariants}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-card rounded-xl shadow-lg flex items-center justify-center p-6 border border-border [backface-visibility:hidden]">
            <h2 className="text-4xl font-bold text-center text-card-foreground">
              {card.front}
            </h2>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full bg-card rounded-xl shadow-lg flex items-center justify-center p-6 border border-border [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <h2 className="text-4xl font-bold text-center text-card-foreground">
              {card.back}
            </h2>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 w-full flex justify-center h-14">
        <AnimatePresence>
          {isFlipped && !isLoading && !isTransitioning && (
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                variant="destructive"
                size="icon"
                className="w-16 h-14 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReviewClick(false);
                }}
              >
                <ThumbsDown className="w-6 h-6" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="w-16 h-14 rounded-lg bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReviewClick(true);
                }}
              >
                <ThumbsUp className="w-6 h-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
