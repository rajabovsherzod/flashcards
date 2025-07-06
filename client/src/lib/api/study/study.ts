import { $api } from "../axios";
import { ApiResponse } from "../api.response";
import { Card } from "../cards/card.types";
import { IReviewCard } from "./study.types";

export interface GetStudyCardsParams {
  deckId: string;
  limit?: number;
  randomOrder?: boolean;
}

export interface BatchReviewPayload {
  reviews: Array<{
    cardId: string;
    knewIt: boolean;
  }>;
}

// O'rganish sessiyasi uchun kartochkalarni oladi
export const getStudyCards = async ({
  deckId,
  limit,
  randomOrder,
}: GetStudyCardsParams): Promise<ApiResponse<Card[]>> => {
  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", String(limit));
  if (randomOrder) queryParams.append("randomOrder", "true");

  const params = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await $api.get<ApiResponse<Card[]>>(
    `/decks/${deckId}/study${params}`
  );
  return response.data;
};

// Bitta kartochkani ko'rib chiqish natijasini yuboradi
export const reviewCard = async ({
  cardId,
  payload,
}: {
  cardId: string;
  payload: IReviewCard;
}): Promise<ApiResponse<Card>> => {
  const response = await $api.post<ApiResponse<Card>>(
    `/cards/${cardId}/review`,
    payload
  );
  return response.data;
};

// Bir nechta kartochkalarni bir safarda ko'rib chiqish
export const batchReviewCards = async (
  payload: BatchReviewPayload
): Promise<ApiResponse<Card[]>> => {
  const response = await $api.post<ApiResponse<Card[]>>(
    `/cards/batch-review`,
    payload
  );
  return response.data;
};
