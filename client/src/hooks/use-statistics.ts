// hooks/use-statistics.ts
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary, getStageDistribution, getPerformance, getHeatmapData } from "@/lib/api/statistics/statistics";
import { ApiResponse } from "@/lib/api/api.response";
import { StageDistributionData, GetPerformancePayload, GetPerformanceResponse, GetHeatmapDataResponse } from "@/lib/api/statistics/statistics.types";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: getDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Har 1 minutda yangilanadi
    refetchOnWindowFocus: true, // Window focus'da yangilanadi
  });
};

export const useStageDistribution = () => {
    return useQuery<ApiResponse<StageDistributionData[]>, Error>({
        queryKey: ["statistics", "stage-distribution"],
        queryFn: getStageDistribution,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
    });
};

export const usePerformance = (payload: GetPerformancePayload) => {
    return useQuery<ApiResponse<GetPerformanceResponse>, Error>({
        queryKey: ["statistics", "performance"],
        queryFn: () => getPerformance(payload),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: true,
    });
};

export const useHeadmapData = () => {
    return useQuery<ApiResponse<GetHeatmapDataResponse[]>, Error>({
        queryKey: ["statistics", "heatmap-data"],
        queryFn: getHeatmapData,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,  
        refetchOnReconnect: true,
    });
}