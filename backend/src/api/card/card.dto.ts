import { Card } from "@generated/prisma"

export class CardDto {
    id: string
    front: string
    back: string
    deckId: string
    createdAt: Date
    updatedAt: Date

    constructor(card: Card){
        this.id = card.id
        this.front = card.front
        this.back = card.back
        this.deckId = card.deckId
        this.createdAt = card.createdAt
        this.updatedAt = card.updatedAt
    }
}