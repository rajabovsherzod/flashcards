import { prisma } from "@/lib/prisma";
import { truncate } from "fs";

class StatisticsService {
    public async getDashboardSummary(userId: string){
        const [totalDecks, totalCards, matureCards] = await Promise.all([
            prisma.deck.count({
                where: {
                    userId
                }
            }),
            prisma.card.count({
                where: {
                    deck: {
                        userId
                    }
                }
            }),
            prisma.card.count({
                where: {
                    deck: {
                        userId
                    },
                    studyStage: {
                        gte: 7
                    }
                }
            })
        ])

        return { totalDecks, totalCards, matureCards }
    }

    public async getStageDistribution(userId: string){
        const stageCounts = await prisma.card.groupBy({
            by: ["studyStage"],
            where: {
                deck: {
                    userId
                }
            },
            _count: {
                _all: true
            },
            orderBy: {
                studyStage: "asc"
            }
        })

        const formattedStageDistribution = stageCounts.map(item => {
            return {
                stage: item.studyStage + 1,
                count: item._count._all
            }
        })

        return formattedStageDistribution
    }

    public async getPerformance(userId: string, period: number){
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - period)

        const [totalReviews, correctReviews] = await prisma.$transaction([
            prisma.reviewLog.count({
                where: {
                    userId: userId,
                    createdAt: {
                        gte: startDate
                    }
                }
            }),
            prisma.reviewLog.count({
                where: {
                    userId: userId,
                    createdAt: {
                        gte: startDate
                    },
                    rating: true
                }
            })            
        ])

        if(totalReviews === 0){
            return {
                totalReviews: 0,
                correctReviews: 0,
            }
        }
        
        return {
            totalReviews,
            correctReviews
        }
    }

    public async getHeatmapData(userId: string){
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

        const reviewLogs = await prisma.reviewLog.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: oneYearAgo
                }
            },
            select: {
                createdAt: true
            }
        })

        const contributions = reviewLogs.reduce((acc, log) => {
            const date = log.createdAt.toISOString().split('T')[0]
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        return Object.entries(contributions).map(([date, count]) => ({ date, count}))
    }
}

export default StatisticsService