import { $api } from "../axios";
import { ApiResponse } from "../api.response";
import { CreateDeckPayload, Deck } from "./deck.types";

export const createDeck = async (
  payload: CreateDeckPayload
): Promise<ApiResponse<Deck>> => {
  const { data } = await $api.post("/decks", payload);
  return data;
};

export const getAllDecks = async (): Promise<ApiResponse<Deck[]>> => {
  const { data } = await $api.get("/decks");
  return data;
};

export const getDeck = async (deckId: string): Promise<ApiResponse<Deck>> => {
  const { data } = await $api.get(`/decks/${deckId}`);
  return data;
};
