// client/src/hooks/use-auth.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { useLoginModal } from "./use-login-modal";

export const useAuth = (requireAuth: boolean = true) => {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const loginModal = useLoginModal();

  useEffect(() => {
    // Faqat hydration tugagandan keyin redirect qilamiz
    if (!hasHydrated) return;

    if (requireAuth && !isAuthenticated) {
      loginModal.onOpen();
    } else if (!requireAuth && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, requireAuth, router, loginModal, hasHydrated]);

  return { isAuthenticated, hasHydrated };
};
