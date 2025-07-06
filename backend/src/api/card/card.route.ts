import { Router } from "express";
import CardController from "./card.controller";
import CardService from "./card.service";
import Deckservice from "../deck/deck.service";
import authMiddleware from "@/middlewares/auth.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { updateCardSchema } from "./card.validation";
import { reviewCardSchema } from "../study/study.validation";
import { studyController } from "../study/study.handler";

const router = Router();

const deckService = new Deckservice();
const cardService = new CardService(deckService);
const cardController = new CardController(cardService);

router.get("/:cardId", authMiddleware, cardController.getCardById);
router.patch(
  "/:cardId",
  authMiddleware,
  validate(updateCardSchema),
  cardController.updateCard
);
router.delete("/:cardId", authMiddleware, cardController.deleteCard);

router.post(
  "/:cardId/review",
  authMiddleware,
  validate(reviewCardSchema),
  studyController.reviewCard
);

export default router;
