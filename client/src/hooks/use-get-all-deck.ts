import { useQuery } from "@tanstack/react-query";
import { getAllDecks } from "@/lib/api/decks/decks";

export const useGetAllDecks = () => {
    return useQuery({
        queryKey: ["decks"],
        queryFn: getAllDecks,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
    });
}