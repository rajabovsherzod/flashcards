import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserData {
  fullName: string;
  email: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: UserData | null;
  hasHydrated: boolean;
  setAuthData: (token: string, userData: UserData) => void;
  setAccessToken: (token: string) => void;
  reset: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      user: null,
      hasHydrated: false,
      setAuthData: (token, userData) =>
        set({
          isAuthenticated: true,
          accessToken: token,
          user: userData,
        }),
      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),
      reset: () =>
        set({
          isAuthenticated: false,
          accessToken: null,
          user: null,
        }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
