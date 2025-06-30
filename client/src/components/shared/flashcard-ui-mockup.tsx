"use client";

import { Check, Rows, Settings, Sigma, Volume2, X } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FlashcardUIMockup = () => {
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
    <div className="w-full h-full bg-background text-foreground flex flex-col p-2 select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-3 pt-5 border-b border-border">
        <h1 className="font-bold text-base">
          FlashCard
          <span className="ml-1 bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
            Pro
          </span>
        </h1>
        <Settings className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4">
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
              <div
                onClick={handleRatingClick}
                className="cursor-pointer bg-red-500/10 text-red-500 h-12 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <X className="w-5 h-5" /> Bilmayman
              </div>
              <div
                onClick={handleRatingClick}
                className="cursor-pointer bg-green-500/10 text-green-500 h-12 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <Check className="w-5 h-5" /> Bilaman
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-around items-center py-2 border-t border-border">
        <div className="flex flex-col items-center gap-1 text-primary">
          <Rows className="w-5 h-5" />
          <span className="text-xs font-bold">Decks</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <Sigma className="w-5 h-5" />
          <span className="text-xs">Study</span>
        </div>
      </div>
    </div>
  );
};

export default FlashcardUIMockup;
