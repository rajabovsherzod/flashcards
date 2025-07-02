import { Request, Response, NextFunction } from "express"
import CardService from "./card.service"
import { validate } from "@/middlewares/validate.middleware"
import ApiResponse from "@/utils/api.Response"

class CardController {
    constructor(private readonly cardService: CardService){
        this.cardService = cardService
    }

    public createCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const { front, back } = req.body
            const userId = req.user!.id
            const card = await this.cardService.createCard( deckId, userId, { front, back })
            res.status(201).json(new ApiResponse(card, "Card created successfully"))
        } catch (error) {
            next(error)
        }
    }

    public createBatchCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const { cards } = req.body
            const userId = req.user!.id
            const batchCards = await this.cardService.createBatchCards(deckId, userId, cards)
            res.status(201).json(new ApiResponse(batchCards, "Cards created successfully"))
        } catch (error) {
          next(error)  
        }
    }

    public getCards = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const userId = req.user!.id
            const cards = await this.cardService.getCards(deckId, userId)
            res.status(200).json(new ApiResponse(cards, "Cards fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public getCardById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cardId } = req.params
            const userId = req.user!.id
            const card = await this.cardService.getCardById(cardId, userId)
            res.status(200).json(new ApiResponse(card, "Card fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public updateCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cardId } = req.params
            const { front, back } = req.body
            const userId = req.user!.id
            const card = await this.cardService.updateCard(cardId, userId, { front, back })
            res.status(200).json(new ApiResponse(card, "Card updated successfully"))
        } catch (error) {
            next(error)
        }
    }

    public deleteCard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cardId } = req.params
            const userId = req.user!.id
            await this.cardService.deleteCard(cardId, userId)
            res.status(204).json()
        } catch (error) {
            next(error)
        }
    }
}

export default CardController