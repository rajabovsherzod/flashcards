"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookOpen, Loader2, ServerCrash } from "lucide-react";
import { useGetAllDecks } from "@/hooks/use-get-all-deck";
import { Deck } from "@/lib/api/decks/deck.types";
import { useModal } from "@/store/use-modal-store";
import { useGetAllCardsByDeckId } from "@/hooks/use-get-all-cards-by-deck-id";
import React from "react";

export function DeckSelectionModal() {
  const { isOpen, type, onClose, onOpen } = useModal();
  const { data: decksResponse, isLoading, error } = useGetAllDecks();
  const [selectedDeckId, setSelectedDeckId] = React.useState<string | null>(
    null
  );
  const { data: allCardsResponse } = useGetAllCardsByDeckId(
    selectedDeckId || ""
  );

  const decks = decksResponse?.data || [];
  const isModalOpen = isOpen && type === "deckSelection";

  const handleDeckSelect = (deck: Deck) => {
    setSelectedDeckId(deck.id);
    // Cardlarni yuklab, locked yoki yo'qligini tekshiramiz
    // Bu hook orqali allCardsResponse keladi
    // Quyida useEffect orqali modal ochamiz
  };

  React.useEffect(() => {
    if (!selectedDeckId || !allCardsResponse) return;
    const cards = allCardsResponse.data || [];
    const now = new Date();
    const lockedCards = cards.filter(
      (card) => card.nextReviewAt && new Date(card.nextReviewAt) > now
    );
    const allLocked = cards.length > 0 && lockedCards.length === cards.length;
    if (allLocked) {
      // LockedInfoModal ochiladi
      const deck = decks.find((d) => d.id === selectedDeckId);
      onOpen("lockedInfo", { deck, lockedCards });
      setSelectedDeckId(null);
    } else if (cards.length > 0) {
      // O'rganiladigan card bor, settings modal ochiladi
      const deck = decks.find((d) => d.id === selectedDeckId);
      onOpen("studySettings", { deck });
      setSelectedDeckId(null);
    }
  }, [selectedDeckId, allCardsResponse, decks, onOpen, onClose]);

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose a Deck
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Select a deck to start a study session.
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex-1 min-h-0 -mx-6 px-6 pb-6">
          <div
            className="h-full overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-teal-500" />
                <p className="mt-4 text-muted-foreground">
                  Loading your decks...
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ServerCrash className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold text-destructive">
                  Failed to load decks
                </h3>
                <p className="text-muted-foreground mt-2">
                  There was a problem connecting to the server.
                </p>
              </div>
            )}

            {!isLoading && !error && decks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decks.map((deck) => (
                  <div
                    key={deck.id}
                    onClick={() => handleDeckSelect(deck)}
                    className="group relative p-5 bg-card rounded-xl border border-border hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col h-full">
                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {deck.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          {deck.cardCount}{" "}
                          {deck.cardCount === 1 ? "card" : "cards"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !error && decks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground">
                  No Decks Found
                </h3>
                <p className="text-muted-foreground mt-2">
                  You haven&apos;t created any decks yet. Create one to start
                  studying.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
