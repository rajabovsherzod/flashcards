import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudyCards,
  reviewCard,
  GetStudyCardsParams,
} from "@/lib/api/study/study";
import { IReviewCard } from "@/lib/api/study/study.types";

// O'rganish uchun kartochkalar ro'yxatini olish uchun hook
export const useGetStudyCards = (
  params: GetStudyCardsParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["study-cards", params.deckId, params.limit, params.randomOrder],
    queryFn: () => getStudyCards(params),
    enabled: enabled && !!params.deckId,
    staleTime: 0, // always fresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1,
  });
};

export const useReviewCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn expects { cardId, payload, deckId }
    mutationFn: ({
      cardId,
      payload,
    }: {
      cardId: string;
      payload: IReviewCard;
      deckId?: string;
    }) => reviewCard({ cardId, payload }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      if (variables?.deckId) {
        queryClient.invalidateQueries({ queryKey: ["deck", variables.deckId] });
      }
    },
  });
};
