import { Router } from "express";
import authRoute from "@/api/auth/auth.route";
import userRoute from "@/api/user/user.route";
import deckRoute from "@/api/deck/deck.route";
import cardRoute from "@/api/card/card.route";
import statisticsRoute from "@/api/statistics/statistics.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/decks", deckRoute);
router.use("/cards", cardRoute);
router.use("/statistics", statisticsRoute);

export default router;
