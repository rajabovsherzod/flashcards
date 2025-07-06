import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudyCards,
  reviewCard,
  GetStudyCardsParams,
} from "@/lib/api/study/study";

// O'rganish uchun kartochkalar ro'yxatini olish uchun hook
export const useGetStudyCards = (
  params: GetStudyCardsParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["study-cards", params.deckId, params.limit, params.randomOrder],
    queryFn: () => getStudyCards(params),
    enabled: enabled && !!params.deckId,
    staleTime: 1000 * 60 * 10, // 10 daqiqa - o'rganish davomida yangilamaslik
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

export const useReviewCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewCard,
    onSuccess: () => {
      // Faqat kerakli query'larni invalidate qilish
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["statistics"] });
      // study-cards query'sini invalidate qilmaymiz - o'rganish davomida barqaror qolishi kerak
    },
  });
};
