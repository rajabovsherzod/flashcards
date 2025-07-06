// This represents the data needed to create a single card within a batch.
export interface CardData {
  front: string;
  back: string;
}

export type CreateBatchCardsPayload = {
  cards: CreateCardPayload[];
};


export type Card = {
  id: string;
  front: string;
  back: string;
  deckId: string;
  nextReviewAt: string; 
  studyStage: number;
  createdAt: string;
  updatedAt: string;
};

// CreateCardPayload ham kerak bo'ladi
export interface CreateCardPayload {
  front: string;
  back: string;
}