"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { RegisterModal } from "../../app/auth/register/register-modal";
import { useRegisterModal } from "@/hooks/use-register-modal";

const Navbar = () => {
  const registerModal = useRegisterModal();

  return (
    <>
      <RegisterModal />
      <div className="w-full z-50">
        <div className="hidden lg:flex flex-row self-center items-center justify-between py-3 mx-auto px-8 rounded-full relative z-[50] w-[80%]">
          <Link
            className="font-normal flex gap-2 justify-center items-center text-sm text-foreground px-2 py-1 shrink-0 relative z-20"
            href="/"
          >
            <span className="font-bold text-lg text-foreground">
              FlashCard
              <span className="ml-1 bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                Pro
              </span>
            </span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                className="px-4 py-2 text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-flex items-center justify-center text-foreground bg-background rounded-[6px] border"
                href="/login"
              >
                Login
              </Link>
              <Button
                onClick={registerModal.onOpen}
                className="px-4 py-2 text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200"
              >
                Signup
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="flex relative flex-col lg:hidden w-full justify-between items-center max-w-[calc(100vw-2rem)] mx-auto z-50">
          <div className="flex flex-row justify-between items-center w-full p-4">
            <Link
              className="font-normal flex gap-2 justify-center items-center text-sm text-foreground px-2 py-1 shrink-0 relative z-20"
              href="/"
            >
              <span className="font-bold text-lg text-foreground">
                FlashCard
                <span className="ml-1 bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                  Pro
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
