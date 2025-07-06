import { $api } from "../axios";
import { CreateBatchCardsPayload, Card } from "./card.types";
import { ApiResponse } from "../api.response";

// The payload now only contains the cards array. The deckId is passed separately.
type CreateCardsInput = {
  deckId: string;
  payload: CreateBatchCardsPayload;
};

// The function now correctly promises a response containing an array of Card objects.
export const createBatchCards = async ({deckId,payload}: CreateCardsInput): Promise<ApiResponse<Card[]>> => {
  const response = await $api.post<ApiResponse<Card[]>>(`/decks/${deckId}/cards/batch`,payload);
  return response.data;
};

export const getAllCardsByDeckId = async ({ deckId }: { deckId: string }): Promise<ApiResponse<Card[]>> => {
  const response = await $api.get<ApiResponse<Card[]>>(`/decks/${deckId}/cards`);
  return response.data;
};
