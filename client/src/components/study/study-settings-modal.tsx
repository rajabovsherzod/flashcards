"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Shuffle } from "lucide-react";
import { useModal } from "@/store/use-modal-store";

export interface StudySettings {
  deckId: string;
  cardLimit: number;
  useRandomOrder: boolean;
}

export function StudySettingsModal() {
  const router = useRouter();
  const { isOpen, type, data, onClose } = useModal();
  const { deck } = data;

  const isModalOpen = isOpen && type === "studySettings";

  const getInitialCardLimit = () => {
    if (!deck) return 10;
    return Math.min(10, deck.cardCount);
  };

  const [cardLimit, setCardLimit] = useState(getInitialCardLimit());
  const [useRandomOrder, setUseRandomOrder] = useState(false);

  useEffect(() => {
    if (deck) {
      setCardLimit(Math.min(10, deck.cardCount));
      setUseRandomOrder(false); // Reset to default when deck changes
    }
  }, [deck]);

  const handleStartStudy = () => {
    if (!deck) return;

    // URL parametrlarini yaratish
    const params = new URLSearchParams({
      deckId: deck.id,
      limit: String(cardLimit),
      random: String(useRandomOrder),
    });

    // Study sahifasiga o'tkazish
    router.push(`/study?${params.toString()}`);
    onClose();
  };

  const getQuickOptions = () => {
    if (!deck || deck.cardCount === 0) return [];
    const maxCards = deck.cardCount;
    const baseOptions = [5, 10, 15, 20, 25];
    const validOptions = baseOptions.filter((opt) => opt < maxCards);
    if (!validOptions.includes(maxCards)) {
      validOptions.push(maxCards);
    }
    return validOptions.sort((a, b) => a - b);
  };

  const quickOptions = getQuickOptions();

  if (!deck) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <Settings className="w-6 h-6 text-primary" />
            Study Settings
          </DialogTitle>
          <DialogDescription>
            Configure your study session for the best experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <h3 className="font-semibold text-foreground">{deck.title}</h3>
            <p className="text-sm text-muted-foreground">
              {deck.cardCount} cards available
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Number of Cards</Label>
            {quickOptions.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {quickOptions.map((option) => (
                  <Button
                    key={option}
                    variant={cardLimit === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCardLimit(option)}
                  >
                    {option === deck.cardCount ? "All" : option}
                  </Button>
                ))}
              </div>
            )}
            <div>
              <Label
                htmlFor="cardLimit"
                className="text-sm text-muted-foreground"
              >
                Or enter a custom amount:
              </Label>
              <Input
                id="cardLimit"
                type="number"
                min="1"
                max={deck.cardCount}
                value={cardLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > deck.cardCount) {
                    setCardLimit(deck.cardCount);
                  } else if (val < 1) {
                    setCardLimit(1);
                  } else {
                    setCardLimit(val || 1);
                  }
                }}
                className="mt-1"
                disabled={deck.cardCount === 0}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Card Order</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={!useRandomOrder ? "default" : "outline"}
                onClick={() => setUseRandomOrder(false)}
              >
                Default
              </Button>
              <Button
                variant={useRandomOrder ? "default" : "outline"}
                onClick={() => setUseRandomOrder(true)}
                className="flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Shuffle
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleStartStudy}
            className="w-full h-12 text-base"
            disabled={deck.cardCount === 0 || !cardLimit}
          >
            Start Study Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
