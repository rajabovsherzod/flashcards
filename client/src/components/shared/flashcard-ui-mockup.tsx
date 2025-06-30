"use client";

import {
  ThumbsUp,
  ThumbsDown,
  Rows,
  Settings,
  Sigma,
  Volume2,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import StatsUIMockup from "./stats-ui-mockup";

const FlashcardView = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRatingButtons, setShowRatingButtons] = useState(false);

  const cardVariants = {
    initial: { rotateY: 0 },
    flipped: { rotateY: 180 },
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowRatingButtons(true);
    } else {
      setShowRatingButtons(false);
    }
  };

  const handleRatingClick = () => {
    setIsFlipped(false);
    setShowRatingButtons(false);
  };

  return (
    <>
      {/* Deck Title & Progress Bar */}
      <div className="px-4 pt-4 space-y-2">
        <p className="text-base font-medium text-center text-muted-foreground">
          English Vocabulary
        </p>
        <div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">
            15/32 cards reviewed
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-3">
        {/* Flippable Card */}
        <div
          className="w-full max-w-xs h-48 perspective-[1000px] cursor-pointer"
          onClick={handleCardClick}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            initial="initial"
            animate={isFlipped ? "flipped" : "initial"}
            variants={cardVariants}
            transition={{ duration: 0.6 }}
          >
            {/* Front of the card */}
            <div className="absolute w-full h-full bg-card rounded-xl shadow-lg flex flex-col items-center justify-center p-4 border border-border [backface-visibility:hidden]">
              <h2 className="text-3xl font-bold text-card-foreground">
                Ephemeral
              </h2>
              <p className="text-muted-foreground">[ɪˈfemərəl]</p>
              <Volume2 className="w-5 h-5 text-muted-foreground mt-4" />
            </div>

            {/* Back of the card */}
            <div className="absolute w-full h-full bg-card rounded-xl shadow-lg flex flex-col items-center justify-center p-4 border border-border [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <h2 className="text-3xl font-bold text-card-foreground">
                O&apos;tkinchi
              </h2>
              <p className="text-muted-foreground">(sifat)</p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {showRatingButtons && (
            <motion.div
              className="mt-4 w-full max-w-xs grid grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="destructive"
                onClick={handleRatingClick}
                className="h-12"
                aria-label="I don't know"
              >
                <ThumbsDown className="w-6 h-6" />
              </Button>
              <Button
                onClick={handleRatingClick}
                className="h-12"
                aria-label="I know"
              >
                <ThumbsUp className="w-6 h-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const FlashcardUIMockup = () => {
  const [activeView, setActiveView] = useState("decks");

  const views: { [key: string]: React.ReactNode } = {
    decks: <FlashcardView />,
    study: <StatsUIMockup />,
  };

  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col p-2 select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-8 border-b border-border">
        <h1 className="font-bold text-base">
          FlashCard
          <span className="ml-1 bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
            Pro
          </span>
        </h1>
        <Settings className="w-4 h-4 text-muted-foreground" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          className="flex-grow flex flex-col"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {views[activeView]}
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      <div className="flex justify-around items-center py-2 border-t border-border">
        <button
          onClick={() => setActiveView("decks")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === "decks"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary/80"
          }`}
        >
          <Rows className="w-5 h-5" />
          <span className="text-xs font-bold">Decks</span>
        </button>
        <button
          onClick={() => setActiveView("study")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === "study"
              ? "text-primary"
              : "text-muted-foreground hover:text-primary/80"
          }`}
        >
          <Sigma className="w-5 h-5" />
          <span className="text-xs">Study</span>
        </button>
      </div>
    </div>
  );
};

export default FlashcardUIMockup;
