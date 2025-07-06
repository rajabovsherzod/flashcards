// client/src/components/auth/protected-page.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedPageProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, hasHydrated } = useAuth(requireAuth);

  // Hydration tugaguncha loading ko'rsatamiz
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Agar autentifikatsiya talab qilinayotgan bo'lsa va foydalanuvchi autentifikatsiya qilmagan bo'lsa
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Agar autentifikatsiya talab qilinmayotgan bo'lsa va foydalanuvchi autentifikatsiya qilgan bo'lsa
  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return <>{children}</>;
};
