import { $api } from "../axios";
import { ApiResponse } from "../api.response";
import { GetDashBoardSummarResponse, StageDistributionData, GetPerformancePayload, GetPerformanceResponse, GetHeatmapDataResponse } from "./statistics.types";

export const getDashboardSummary = async (): Promise<ApiResponse<GetDashBoardSummarResponse>> => {
    const { data } = await $api.get("/statistics/dashboard-summary");
    return data;
}

export const getStageDistribution = async (): Promise<ApiResponse<StageDistributionData[]>> => {
    const { data } = await $api.get("/statistics/stage-distribution");
    return data;
}

export const getPerformance = async (payload: GetPerformancePayload): Promise<ApiResponse<GetPerformanceResponse>> => {
    const { data } = await $api.get("/statistics/performance", { params: payload });
    return data;
}

export const getHeatmapData = async (): Promise<ApiResponse<GetHeatmapDataResponse[]>> => {
    const { data } = await $api.get("/statistics/heatmap-data");
    return data;
}