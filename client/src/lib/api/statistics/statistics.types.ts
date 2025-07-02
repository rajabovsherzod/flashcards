export interface GetDashBoardSummarResponse {
    totalDecks: number,
    totalCards: number,
    matureCards: number
}

export interface StageDistributionData {
    stage: number,
    count: number
}

export interface GetPerformancePayload {
    period: number
}

export interface GetPerformanceResponse {
    totalReviews: number,
    correctReviews: number
}

export interface GetHeatmapDataResponse {
    date: string,
    count: number
}


