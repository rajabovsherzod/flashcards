import { Request, Response, NextFunction } from "express"
import StudyService from "./study.service"
import ApiResponse from "@/utils/api.Response"


class StudyController {
    constructor(private readonly studyService: StudyService){
        this.studyService = studyService
    }

    public getStudyCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
            const userId = req.user!.id
            const cards = await this.studyService.getStudyCards(deckId, limit, userId)
            res.status(200).json(new ApiResponse(cards, "Study cards fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public reviewCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cardId } = req.params
            const { knewIt } = req.body
            const userId = req.user!.id
            const card = await this.studyService.reviewCard(cardId, { knewIt }, userId)
            res.status(200).json(new ApiResponse(card, "Card reviewed successfully"))
        } catch (error) {
            next(error)
        }
    }
}

export default StudyController