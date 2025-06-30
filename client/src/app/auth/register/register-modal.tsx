"use client";

import { useRegisterModal } from "@/hooks/use-register-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Step1Details } from "./register-steps/step-name-email";
import { Step2Verify } from "./register-steps/step-verify-email";
import { Step3Password } from "./register-steps/step-set-password";

// Har bir qadamga mos komponentni bu yerda aniqlab olamiz
const stepComponents = {
  1: Step1Details,
  2: Step2Verify,
  3: Step3Password,
};

export function RegisterModal() {
  const { isOpen, onClose, step } = useRegisterModal();

  // Joriy qadamga mos komponentni tanlaymiz
  const CurrentStepComponent = stepComponents[step as keyof typeof stepComponents];

  const handleClose = () => {
    // Modal yopilganda, holatni boshlang'ich holatiga qaytarish uchun
    // useRegisterModal ichidagi reset funksiyasini chaqirish mumkin (agar mavjud bo'lsa)
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

        {/* Bu div modalning o'lchamini bir xil ushlab turadi */}
        <div className="mt-6 min-h-[280px]">
          {CurrentStepComponent && <CurrentStepComponent />}
        </div>
      </DialogContent>
    </Dialog>
  );
}