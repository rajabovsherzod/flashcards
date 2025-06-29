import { Router } from "express";
import DeckController from "./deck.controller";
import Deckservice from "./deck.service";
import { validate } from "@/middlewares/validate.middleware";
import { createDeckSchema, updateDeckSchema } from "./deck.validation";
import authMiddleware from "@/middlewares/auth.middleware";
import CardController from "../card/card.controller";
import CardService from "../card/card.service";
import StudyController from "../study/study.controller";
import StudyService from "../study/study.service";
import { createCardSchema } from "../card/card.validation";


const router = Router()

const deckService = new Deckservice();
const deckController = new DeckController(deckService);

const cardService = new CardService(deckService);
const cardController = new CardController(cardService);

const studyService = new StudyService(cardService);
const studyController = new StudyController(studyService);

router.post('/', authMiddleware, validate(createDeckSchema), deckController.createDeck);
router.get('/', authMiddleware, deckController.getDecks)
router.get('/:deckId', authMiddleware, deckController.getDeckById)
router.patch('/:deckId', authMiddleware, validate(updateDeckSchema), deckController.updateDeck)
router.delete('/:deckId', authMiddleware, deckController.deleteDeck)


router.post('/:deckId/cards', authMiddleware, validate(createCardSchema), cardController.createCard)
router.get('/:deckId/cards', authMiddleware, cardController.getCards)

router.get('/:deckId/study', authMiddleware, studyController.getStudyCards)




export default router
