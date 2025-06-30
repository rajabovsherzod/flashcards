import { create } from "zustand";

interface AuthStore {
  fullName: string | null;
  email: string | null;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  fullName: null,
  email: null,

  setFullName: (name) => set({ fullName: name }),
  setEmail: (email) => set({ email: email }),

  reset: () => set({ fullName: null, email: null }),
}));