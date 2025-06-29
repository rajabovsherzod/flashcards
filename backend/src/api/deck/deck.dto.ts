import { Deck, QuizType, LearningMode } from "@generated/prisma";

export class DeckDto {
    id: string
    title: string
    quizType: QuizType
    learningMode: LearningMode
    isRandomOrder: boolean
    cardCount: number
    createdAt: Date

    constructor(deck: Deck & {_count?: {cards: number}}){
        this.id = deck.id
        this.title = deck.title
        this.quizType = deck.quizType
        this.learningMode = deck.learningMode
        this.isRandomOrder = deck.isRandomOrder
        this.cardCount = deck._count?.cards ?? 0
        this.createdAt = deck.createdAt
    }
}