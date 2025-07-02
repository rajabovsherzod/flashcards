import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
  setFullName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUserData: (userData: { fullName: string; email: string }) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      fullName: "",
      email: "",
      isAuthenticated: false,
      setFullName: (name) => set({ fullName: name }),
      setEmail: (email) => set({ email: email }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUserData: (userData) =>
        set({
          fullName: userData.fullName,
          email: userData.email,
          isAuthenticated: true,
        }),
      reset: () => set({ fullName: "", email: "", isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage), // localStorage'da saqlash
      partialize: (state) => ({
        fullName: state.fullName,
        email: state.email,
        isAuthenticated: state.isAuthenticated,
      }), 
    }
  )
);
