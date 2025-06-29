import { Request, Response, NextFunction } from "express";
import StatisticsService from "./statistics.service";
import ApiResponse from "@/utils/api.Response";

class StatisticsController {
    constructor(private readonly statisticsService: StatisticsService) {}

    public getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const summary = await this.statisticsService.getDashboardSummary(userId);
            res.status(200).json(new ApiResponse(summary, "Dashboard summary fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    public getStageDistribution = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id
            const distribution = await this.statisticsService.getStageDistribution(userId)
            res.status(200).json(new ApiResponse(distribution, "Stage distribution fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public getPerformance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id
            const period = req.query.period ? parseInt(req.query.period as string, 10) : 7
            const performance = await this.statisticsService.getPerformance(userId, period)
            res.status(200).json(new ApiResponse(performance, "Performance metrics fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public getHeatmapData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id
            const heatmap = await this.statisticsService.getHeatmapData(userId)
            res.status(200).json(new ApiResponse(heatmap, "Heatmap data fetched successfully"))
        } catch (error) {
            next(error)
        }
    }
}

export default StatisticsController;
