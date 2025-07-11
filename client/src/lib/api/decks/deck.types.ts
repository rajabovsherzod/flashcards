export type QuizType = "FLASHCARD" | "FLASHCARD_REVERSE" | "TYPING";
export type LearningMode = "CRAM" | "NORMAL" | "LAZY";

export interface CreateDeckPayload {
  title: string;
  quizType: QuizType;
  learningMode: LearningMode;
}

export interface Deck {
  id: string;
  title: string;
  quizType: QuizType;
  learningMode: LearningMode;
  isRandomOrder: boolean;
  cardCount: number;
  createdAt: string;
}
