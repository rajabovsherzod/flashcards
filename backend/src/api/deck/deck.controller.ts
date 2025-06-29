import { Request, Response, NextFunction } from "express"
import Deckservice from "./deck.service"
import ApiResponse from "@/utils/api.Response"


class DeckController {
    constructor(private readonly deckService: Deckservice){
        this.deckService = deckService;
    }

    public createDeck = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {title, quizType, learningMode, isRandomOrder} = req.body;
            const userId = req.user!.id;
            const deck = await this.deckService.createDeck({title, quizType, learningMode, isRandomOrder}, userId);
            res.status(201).json(new ApiResponse(deck, "Deck created successfully"));
        } catch (error) {
            next(error)
        }
    }

    public getDecks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id
            const decks = await this.deckService.getDecks(userId)
            res.status(200).json(new ApiResponse(decks, "Decks fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public getDeckById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const userId = req.user!.id
            const deck = await this.deckService.getDeckById(deckId, userId)
            res.status(200).json(new ApiResponse(deck, "Deck fetched successfully"))
        } catch (error) {
            next(error)
        }
    }

    public updateDeck = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const userId = req.user!.id
            const {title, quizType, learningMode, isRandomOrder} = req.body
            const deck = await this.deckService.updateDeck(deckId, userId, {title, quizType, learningMode, isRandomOrder})
            res.status(200).json(new ApiResponse(deck, "Deck updated successfully"))
        } catch (error) {
            next(error)
        }
    }

    public deleteDeck = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { deckId } = req.params
            const userId = req.user!.id
            await this.deckService.deleteDeck(deckId, userId)
            res.status(204).json()
        } catch (error) {
            next(error)
        }
    }
    
}

export default DeckController;