import { create } from "zustand";

interface CreateCardModalStore {
    isOpen: boolean,
    deckId: string,
    onClose: () => void,
    onOpen: (deckId: string) => void,
}

export const useCreateCardModal = create<CreateCardModalStore>((set) => ({
    isOpen: false,
    deckId: "",
    onClose: () => set({ isOpen: false, deckId: "" }),
    onOpen: (deckId) => set({ isOpen: true, deckId }),
}));
