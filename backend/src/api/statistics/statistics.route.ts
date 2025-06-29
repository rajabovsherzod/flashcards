import { Router } from "express"
import StatisticsController from "./statistics.controller"
import StatisticsService from "./statistics.service"
import authMiddleware from "@/middlewares/auth.middleware"


const router = Router()

const statisticsService = new StatisticsService()
const statisticsController = new StatisticsController(statisticsService)

router.get("/dashboard-summary", authMiddleware, statisticsController.getDashboardSummary)
router.get("/stage-distribution", authMiddleware, statisticsController.getStageDistribution)
router.get("/performance", authMiddleware, statisticsController.getPerformance)
router.get("/heatmap", authMiddleware, statisticsController.getHeatmapData)

export default router

