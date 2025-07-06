import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/lib/api/decks/decks";

export const useGetDeck = (deckId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeck(deckId),
    enabled: enabled && !!deckId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};
