// This represents the data needed to create a single card within a batch.
export interface CardData {
  front: string;
  back: string;
}

export interface CreateBatchCardsPayload {
  cards: CardData[];
}

// This represents a full Card object as returned by the backend.
export interface Card {
  id: string;
  front: string;
  back: string;
  deckId: string;
  stage: number;
  nextReview: string;
  createdAt: string;
  updatedAt: string;
}

// We don't need a separate BatchCardsApiResponse.
// The generic ApiResponse<Card[]> is sufficient.
