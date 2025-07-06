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
  const [isCardChanging, setIsCardChanging] = useState(false);

  const handleCardFlip = useCallback(() => {
    if (!isLoading && !isTransitioning && !isCardChanging) {
      setIsFlipped(!isFlipped);
    }
  }, [isLoading, isTransitioning, isCardChanging, isFlipped]);

  const handleReviewClick = useCallback(
    (knewIt: boolean) => {
      // Prevent multiple clicks while transitioning
      if (isLoading || isTransitioning || isCardChanging) return;

      setIsTransitioning(true);

      // 1. First, flip the card back to front (complete 180° rotation)
      setIsFlipped(false);

      // 2. Wait for the flip animation to complete (0.6s)
      setTimeout(() => {
        // 3. Start card change animation
        setIsCardChanging(true);

        // 4. After a brief moment, call onReview and reset states
        setTimeout(() => {
          onReview(card.id, knewIt);
          setIsTransitioning(false);
          setIsCardChanging(false);
        }, 200); // Brief pause for smooth transition
      }, 600); // Wait for flip animation to complete
    },
    [isLoading, isTransitioning, isCardChanging, card.id, onReview]
  );

  const cardVariants = {
    initial: { rotateY: 0 },
    flipped: { rotateY: 180 },
  };

  const cardContainerVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.1,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const progressBarWidth = totalCards > 0 ? (cardNumber / totalCards) * 100 : 0;

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto flex flex-col items-center"
      variants={cardContainerVariants}
      initial="hidden"
      animate={isCardChanging ? "hidden" : "visible"}
    >
      {/* Progress Bar */}
      <div className="w-full px-4 mb-2">
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
        className="w-full max-w-xl h-72 perspective-[1000px] cursor-pointer mb-4"
        onClick={handleCardFlip}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
          initial="initial"
          animate={isFlipped ? "flipped" : "initial"}
          variants={cardVariants}
          transition={{
            duration: 0.6,
            ease: [0.4, 0.0, 0.2, 1], // Custom easing for smooth flip
          }}
        >
          {/* Front */}
          <div className="absolute w-full h-full bg-card rounded-xl shadow-lg flex items-center justify-center p-6 border border-border [backface-visibility:hidden]">
            <motion.h2
              className="text-4xl font-bold text-center text-card-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {card.front}
            </motion.h2>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full bg-card rounded-xl shadow-lg flex items-center justify-center p-6 border border-border [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <motion.h2
              className="text-4xl font-bold text-center text-card-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {card.back}
            </motion.h2>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 w-full flex justify-center h-14">
        <AnimatePresence>
          {isFlipped && !isLoading && !isTransitioning && (
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
                ease: "easeOut",
              }}
            >
              <Button
                variant="destructive"
                size="icon"
                className="w-16 h-14 rounded-lg transition-all duration-200 hover:scale-105"
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
                className="w-16 h-14 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
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
          <motion.div
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
