import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/store/use-modal-store";
import { BookOpen } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useGetDeck } from "@/hooks/use-get-deck";

export const LockedInfoModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const isModalOpen = isOpen && type === "lockedInfo";
  const { deck, lockedCards, deckId } = data;

  // Agar deck obyekti yo'q bo'lsa, deckId orqali olish
  const { data: deckData } = useGetDeck(deckId || "", isModalOpen && !deck);
  const currentDeck = deck || deckData?.data;

  if (!currentDeck || !lockedCards || lockedCards.length === 0) return null;

  const now = new Date();
  // Stage statistikasi va eng yaqin review
  const stageStats: Record<string, { count: number; next: Date | null }> = {};
  let nextReviewTime: Date | null = null;
  lockedCards.forEach((card) => {
    const stage = String(card.studyStage ?? 0);
    if (!stageStats[stage]) stageStats[stage] = { count: 0, next: null };
    stageStats[stage].count += 1;
    const cardNext = card.nextReviewAt ? new Date(card.nextReviewAt) : null;
    if (cardNext) {
      if (!stageStats[stage].next || cardNext < stageStats[stage].next) {
        stageStats[stage].next = cardNext;
      }
      if (!nextReviewTime || cardNext < nextReviewTime) {
        nextReviewTime = cardNext;
      }
    }
  });

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md w-full text-center p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            All cards are locked!
          </DialogTitle>
          <DialogDescription>
            No cards are available for study in <b>{currentDeck.title}</b> right
            now.
          </DialogDescription>
        </DialogHeader>
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        {nextReviewTime && (
          <div className="mb-4">
            <b>
              Next card will be available{" "}
              {formatDistanceToNow(nextReviewTime, { addSuffix: true })}
            </b>
            <br />
            <span className="text-xs text-muted-foreground">
              ({format(nextReviewTime, "PPPp")})
            </span>
          </div>
        )}
        <div className="mb-6 text-left text-sm">
          <div className="font-semibold mb-1">Cards by stage:</div>
          {Object.entries(stageStats).map(([stage, { count, next }]) => (
            <div key={stage} className="flex justify-between">
              <span>Stage {stage}:</span>
              <span>
                {count} card{count > 1 ? "s" : ""}
                {next && new Date(next) > now && (
                  <>
                    {" "}
                    (next in {formatDistanceToNow(next, { addSuffix: true })})
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full mt-4">
            Back to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
