import { create } from "zustand";

type RegisterModalStore = {
    isOpen: boolean;
    step: number,
    onOpen: () => void,
    onClose: () => void,
    nextStep: () => void,
    prevStep: () => void,
    reset: () => void,
}

export const useRegisterModal = create<RegisterModalStore>((set) => ({
    isOpen: false,
    step: 1,
    onOpen: () => set({ isOpen: true, step: 1 }),
    onClose: () => set({ isOpen: false }),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
    reset: () => set({ step: 1 }),
}));