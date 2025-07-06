"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { RegisterModal } from "../../app/auth/register/register-modal";
import { useRegisterModal } from "@/hooks/use-register-modal";
import { LoginModal } from "../../app/auth/login/login-modal";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useAuthStore } from "@/store/auth-store";
import { User, ChevronDown, Home, BookOpen, GraduationCap } from "lucide-react";
import { useModal } from "@/store/use-modal-store";

const Navbar = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const { onOpen } = useModal();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();
  const router = useRouter();

  // Extract user data safely
  const fullName = user?.fullName;
  const email = user?.email;

  useEffect(() => {
    router.prefetch("/dashboard");
    router.prefetch("/decks");
    router.prefetch("/study");
  }, [router]);

  // Hydration tugaguncha navbar'ni ko'rsatmaymiz
  if (!hasHydrated) {
    return (
      <div className="w-full z-50">
        <div className="hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-4 relative z-[50] max-w-7xl">
          <Link
            className="font-normal flex gap-2 justify-center items-center text-sm text-foreground px-2 py-1 shrink-0 relative z-20"
            href="/"
          >
            <span className="font-bold text-lg text-foreground">
              FlashCard
              <span className="ml-1 bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                Pro
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RegisterModal />
      <LoginModal />
      <div className="w-full z-50">
        {/* Desktop Navbar */}
        <div className="hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-4 relative z-[50] max-w-7xl">
          <Link
            className="font-normal flex gap-2 justify-center items-center text-sm text-foreground px-2 py-1 shrink-0 relative z-20"
            href="/"
          >
            <span className="font-bold text-lg text-foreground">
              FlashCard
              <span className="ml-1 bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                Pro
              </span>
            </span>
          </Link>

          {/* Navigation Links - Only show for authenticated users */}
          {isAuthenticated && (
            <div className="flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/decks">
                <Button variant="ghost" size="sm" className="text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Decks
                </Button>
              </Link>
              <Button
                onClick={() => onOpen("deckSelection")}
                variant="ghost"
                size="sm"
                className="text-sm"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Study
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              /* Authenticated User Menu */
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/20 rounded-lg border border-teal-200 dark:border-teal-800/30">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {fullName || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button> */}
              </div>
            ) : (
              /* Guest User Buttons */
              <div className="flex items-center gap-2">
                <Button
                  onClick={loginModal.onOpen}
                  variant="outline"
                  className="px-4 py-2 text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200"
                >
                  Login
                </Button>
                <Button
                  onClick={registerModal.onOpen}
                  className="px-4 py-2 text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 bg-teal-600 hover:bg-teal-700"
                >
                  Signup
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="flex relative flex-col lg:hidden w-full justify-between items-center max-w-7xl mx-auto z-50">
          <div className="flex flex-row justify-between items-center w-full p-4">
            <Link
              className="font-normal flex gap-2 justify-center items-center text-sm text-foreground px-2 py-1 shrink-0 relative z-20"
              href="/"
            >
              <span className="font-bold text-lg text-foreground">
                FlashCard
                <span className="ml-1 bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">
                  Pro
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div tabIndex={0}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="tabler-icon tabler-icon-menu-2 text-foreground/90"
                  >
                    <path d="M4 6l16 0" />
                    <path d="M4 12l16 0" />
                    <path d="M4 18l16 0" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation Links */}
          {isAuthenticated && (
            <div className="w-full px-4 pb-4">
              <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/decks">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Decks
                  </Button>
                </Link>
                <Button
                  onClick={() => onOpen("deckSelection")}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Study
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
