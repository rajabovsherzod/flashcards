"use client";

import { useLoginModal } from "@/hooks/use-login-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";

export function LoginModal() {
  const { isOpen, onClose } = useLoginModal();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-8">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold tracking-tight">
            FlashCard
            <span className="ml-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Pro
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 min-h-[280px]">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
