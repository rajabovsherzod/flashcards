import { create } from "zustand";
import { Deck } from "@/lib/api/decks/deck.types";
import { Card } from "@/lib/api/cards/card.types";

export type ModalType =
  | "deckSelection"
  | "studySettings"
  | "lockedInfo"
  | "studySession"
  | "studyResults";

interface ModalData {
  deck?: Deck;
  lockedCards?: Card[];
  // Study session uchun
  deckId?: string;
  cardLimit?: number;
  useRandomOrder?: boolean;
  // Study results uchun
  studyResult?: {
    totalCards: number;
    correctAnswers: number;
    incorrectAnswers: number;
    studyDuration: number;
    deckTitle: string;
  };
  // Kelajakda boshqa ma'lumotlar qo'shilishi mumkin
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
