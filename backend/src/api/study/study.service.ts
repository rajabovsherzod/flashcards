import { prisma } from "@/lib/prisma"
import CardService from "../card/card.service"
import ApiError from "@/utils/api.Error"
import { CardDto } from "../card/card.dto"
import { IReviewCard } from "./study.types"
import { getIntervalForStage, calculateNextStage } from "@/utils/repetition"

class StudyService {
    constructor(private readonly cardService: CardService){
        this.cardService = cardService
    }

    public async getStudyCards(deckId: string, limit: number | undefined, userId: string){
        const { deck } = await this.cardService.checkCardOwnership(deckId, userId)

        const cardsToReview = await prisma.card.findMany({
            where: {
                deckId: deckId,
                nextReviewAt: { lte: new Date() },
            },
            take: limit || 10,
        })

        if(deck.isRandomOrder){
            cardsToReview.sort(() => Math.random() - 0.5)
        }

        return cardsToReview.map(card => new CardDto(card))
    }

    public async reviewCard(cardId: string, data: IReviewCard, userId: string){
        const { card, deck } = await this.cardService.checkCardOwnership(cardId, userId)
        let newStudyStage = calculateNextStage(card.studyStage, data.knewIt, deck.learningMode)
        const intervalInDays = getIntervalForStage(newStudyStage, deck.learningMode)
        const nextReviewAt = new Date()
        nextReviewAt.setDate(nextReviewAt.getDate() + intervalInDays)

        const [updatedCard] = await prisma.$transaction([
            prisma.card.update({
                where: {
                    id: cardId
                },
                data: {
                    studyStage: newStudyStage,
                    nextReviewAt: nextReviewAt
                }
            }),
            prisma.reviewLog.create({
                data: {
                    cardId: cardId,
                    userId: userId,
                    rating: data.knewIt,
                }
            })
        ])

        return new CardDto(updatedCard)
    }
}


export default StudyService