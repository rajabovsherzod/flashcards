import { Request, Response, NextFunction } from "express";
import StudyService from "./study.service";
import ApiResponse from "@/utils/api.Response";

class StudyController {
  constructor(private readonly studyService: StudyService) {
    this.studyService = studyService;
  }

  public getStudyCards = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { deckId } = req.params;
      // Validatsiyadan o'tgan va tozalangan qiymatlarni olamiz
      const { limit, randomOrder } = req.query;
      const userId = req.user!.id;

      const cards = await this.studyService.getStudyCards(
        deckId,
        userId,
        // Tiplarni to'g'ri o'tkazamiz
        limit as number | undefined,
        randomOrder as boolean | undefined
      );

      res
        .status(200)
        .json(new ApiResponse(cards, "Study cards fetched successfully"));
    } catch (error) {
      next(error);
    }
  };

  public reviewCard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cardId } = req.params;
      // Bodydan `knewIt` qiymatini olamiz
      const { knewIt } = req.body;
      const userId = req.user!.id;

      const card = await this.studyService.reviewCard(
        cardId,
        { knewIt },
        userId
      );

      res.status(200).json(new ApiResponse(card, "Card reviewed successfully"));
    } catch (error) {
      next(error);
    }
  };
}

export default StudyController;