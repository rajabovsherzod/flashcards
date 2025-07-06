import { Router } from "express";
import DeckController from "./deck.controller";
import Deckservice from "./deck.service";
import { validate } from "@/middlewares/validate.middleware";
import { createDeckSchema, updateDeckSchema } from "./deck.validation";
import authMiddleware from "@/middlewares/auth.middleware";
import CardController from "../card/card.controller";
import CardService from "../card/card.service";
import {
  createCardSchema,
  createBatchCardsSchema,
} from "../card/card.validation";
import { studyController } from "../study/study.handler";
import { getStudyCardsSchema } from "../study/study.validation";

const router = Router();

const deckService = new Deckservice();
const deckController = new DeckController(deckService);

const cardService = new CardService(deckService);
const cardController = new CardController(cardService);

router.post(
  "/",
  authMiddleware,
  validate(createDeckSchema),
  deckController.createDeck
);
router.get("/", authMiddleware, deckController.getDecks);
router.get("/:deckId", authMiddleware, deckController.getDeckById);
router.patch(
  "/:deckId",
  authMiddleware,
  validate(updateDeckSchema),
  deckController.updateDeck
);
router.delete("/:deckId", authMiddleware, deckController.deleteDeck);

router.post(
  "/:deckId/cards",
  authMiddleware,
  validate(createCardSchema),
  cardController.createCard
);
router.post(
  "/:deckId/cards/batch",
  authMiddleware,
  validate(createBatchCardsSchema),
  cardController.createBatchCards
);
router.get("/:deckId/cards", authMiddleware, cardController.getCards);

// Study route for a specific deck
router.get(
  "/:deckId/study",
  authMiddleware,
  validate(getStudyCardsSchema),
  studyController.getStudyCards
);

export default router;
