import { prisma } from "@/lib/prisma";
import DeckService from "../deck/deck.service";
import CardService from "../card/card.service";
import { CardDto } from "../card/card.dto";
import { IReviewCard } from "./study.types";
import { getIntervalForStage, calculateNextStage } from "@/utils/repetition";

class StudyService {
  constructor(
    private readonly deckService: DeckService,
    private readonly cardService: CardService
  ) {}

  public async getStudyCards(
    deckId: string,
    userId: string,
    limit: number = 10,
    randomOrder: boolean = false
  ) {
    // 1. Check ownership
    const deck = await this.deckService.checkDeckOwnership(deckId, userId);

    // 2. Fetch ALL cards for the deck
    const allCardsInDeck = await prisma.card.findMany({
      where: { deckId },
    });

    // 3. Filter cards in application code
    const now = new Date();
    const cardsReadyForReview = allCardsInDeck.filter((card) => {
      const isDue = card.nextReviewAt <= now;
      const isNew = card.studyStage === 0;
      return isDue || isNew;
    });

    // 4. Shuffle if requested
    let processedCards = [...cardsReadyForReview];
    if (randomOrder) {
      processedCards.sort(() => Math.random() - 0.5);
    }

    // 5. Apply limit
    const finalCards = processedCards.slice(0, limit);

    return finalCards.map((card) => new CardDto(card));
  }

  public async reviewCard(
    cardId: string,
    data: IReviewCard,
    userId: string
  ) {
    const { card, deck } = await this.cardService.checkCardOwnership(
      cardId,
      userId
    );

    const newStudyStage = calculateNextStage(
      card.studyStage,
      data.knewIt,
      deck.learningMode
    );
    const rawInterval = getIntervalForStage(newStudyStage, deck.learningMode);
    const intervalInDays = Math.max(1, Math.round(rawInterval));

    const now = new Date();
    const nextReviewAt = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    nextReviewAt.setUTCDate(nextReviewAt.getUTCDate() + intervalInDays);

    const [updatedCard] = await prisma.$transaction([
      prisma.card.update({
        where: { id: cardId },
        data: {
          studyStage: newStudyStage,
          nextReviewAt,
        },
      }),
      prisma.reviewLog.create({
        data: {
          cardId,
          userId,
          rating: data.knewIt,
        },
      }),
    ]);

    return new CardDto(updatedCard);
  }
}

export default StudyService;