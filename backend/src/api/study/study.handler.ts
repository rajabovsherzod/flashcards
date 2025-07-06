import StudyController from "./study.controller";
import StudyService from "./study.service";
import DeckService from "../deck/deck.service";
import CardService from "../card/card.service";

// Barcha kerakli qismlarni bitta joyda yaratamiz
const deckService = new DeckService();
const cardService = new CardService(deckService);
const studyService = new StudyService(deckService, cardService);
const studyController = new StudyController(studyService);

// Faqat controllerni eksport qilamiz, chunki route'larga shu kerak
export { studyController };
