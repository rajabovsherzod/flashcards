import { prisma } from "@/lib/prisma"
import ApiError from "@/utils/api.Error"
import { ICreateCard, IUpdateCard } from "./card.types"
import DeckService from "../deck/deck.service"
import { Card, Deck } from "@generated/prisma"
import { CardDto } from "./card.dto"
import { ICreateBatchCards } from "./card.validation"
class CardService {
    constructor(private readonly deckService: DeckService){
        this.deckService = deckService
    }

    public async checkCardOwnership(cardId: string, userId: string): Promise<{ deck: Deck, card: Card }> {
        const card = await prisma.card.findUnique({
            where: {
                id: cardId
            }
        })
        if(!card) throw new ApiError(404, "Card not found")
        const deck = await this.deckService.checkDeckOwnership(card.deckId, userId)
        return { deck, card }
    }

    public async createCard( deckId: string, userId: string, data: ICreateCard){
        await this.deckService.checkDeckOwnership(deckId, userId)
        const card = await prisma.card.create({
            data: {
                front: data.front,
                back: data.back,
                deckId
            }
        })
        return card
    }

    public async createBatchCards(deckId: string, userId: string, cards: ICreateBatchCards[]){
        await this.deckService.checkDeckOwnership(deckId, userId)
        const cardCreationPromises = cards.map(card => {
            return prisma.card.create({
                data: {
                    front: card.front,
                    back: card.back,
                    deckId
                }
            })
        })
        const newCards = await prisma.$transaction(cardCreationPromises)
        return newCards.map(card => new CardDto(card))
    }

    public async getCards(deckId: string, userId: string){
        await this.deckService.checkDeckOwnership(deckId, userId)
        const cards = await prisma.card.findMany({
            where: {
                deckId
            }
        })
        return cards.map(card => new CardDto(card))
    }

    public async getCardById(cardId: string, userId: string){
        const { card } = await this.checkCardOwnership(cardId, userId)
        return new CardDto(card)
    }

    public async updateCard(cardId: string, userId: string, data: IUpdateCard){
        await this.checkCardOwnership(cardId, userId)
        const updatedCard = await prisma.card.update({
            where: {
                id: cardId
            },
            data: {
                front: data.front,
                back: data.back
            }
        })
        return new CardDto(updatedCard)
    }

    public async deleteCard(cardId: string, userId: string){
        await this.checkCardOwnership(cardId, userId)
        await prisma.card.delete({
            where: {
                id: cardId
            }
        })
    }
}

export default CardService