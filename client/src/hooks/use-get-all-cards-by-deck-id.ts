import { useQuery } from "@tanstack/react-query";
import { getAllCardsByDeckId } from "../lib/api/cards/cards";

export const useGetAllCardsByDeckId = (deckId: string) => {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getAllCardsByDeckId({ deckId }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
    enabled: !!deckId,
  });
};
