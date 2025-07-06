import { prisma } from "@/lib/prisma";
import ApiError from "@/utils/api.Error";
import { ICreateDeck, IUpdateCheck } from "./deck.types";
import { DeckDto } from "./deck.dto";
import { Deck } from "@generated/prisma";
class Deckservice {
    public async checkDeckOwnership(deckId: string, userId: string): Promise<Deck> {
        const deck = await prisma.deck.findUnique({ where: { id: deckId } });
        if (!deck) throw new ApiError(404, "Deck not found");
        if (deck.userId !== userId) throw new ApiError(403, "You are not authorized to access this resource");
        return deck
    }

    public async createDeck(data: ICreateDeck, userId: string) {
        const deck = await prisma.deck.create({
            data: {
                title: data.title,
                quizType: data.quizType,
                learningMode: data.learningMode,
                userId: userId,
            },
            include: {
                _count: {
                    select: { cards: true}
                }
            }
        });
        return new DeckDto(deck);
    }

    public async getDecks(userId: string){
        const decks = await prisma.deck.findMany({
            where: {
                userId: userId
            },
            include: {
                _count: {
                    select: { cards: true}
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        return decks.map(deck => new DeckDto(deck))
    }

    public async getDeckById(deckId: string, userId: string){
       const deck = await this.checkDeckOwnership(deckId, userId)
        return new DeckDto(deck)
    }

    public async updateDeck(deckId: string, userId: string, data: IUpdateCheck){
        await this.checkDeckOwnership(deckId, userId)
        const updatedDeck = await prisma.deck.update({
            where: {
                id: deckId
            },
            data: {
                title: data.title,
                quizType: data.quizType,
                learningMode: data.learningMode,
                isRandomOrder: data.isRandomOrder
            }
        })
        return new DeckDto(updatedDeck)
    }

    public async deleteDeck(deckId: string, userId: string){
        await this.checkDeckOwnership(deckId, userId)
        await prisma.deck.delete({
            where: {
                id: deckId
            }
        })
    }
}

export default Deckservice;
