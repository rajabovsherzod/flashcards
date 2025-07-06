import { Card } from "@generated/prisma"

export class CardDto {
    id: string
    front: string
    back: string
    deckId: string
    nextReviewAt: Date
    studyStage: number
    createdAt: Date
    updatedAt: Date

    constructor(card: Card){
        this.id = card.id
        this.front = card.front
        this.back = card.back
        this.deckId = card.deckId
        this.nextReviewAt = card.nextReviewAt
        this.studyStage = card.studyStage
        this.createdAt = card.createdAt
        this.updatedAt = card.updatedAt
    }
}