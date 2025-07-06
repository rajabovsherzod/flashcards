"use client";

import { useEffect, useState } from "react";
import { StudySettingsModal } from "@/components/study/study-settings-modal";
import { StudySessionModal } from "@/components/study/study-session-modal";
import { StudyResultsModal } from "@/components/study/study-results-modal";
import { DeckSelectionModal } from "@/components/study/deck-selection-modal";
import { LockedInfoModal } from "@/components/study/locked-info-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DeckSelectionModal />
      <StudySettingsModal />
      <StudySessionModal />
      <StudyResultsModal />
      <LockedInfoModal />
    </>
  );
};
