import { create } from "zustand";

type CreateDeckModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateDeckModal = create<CreateDeckModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
