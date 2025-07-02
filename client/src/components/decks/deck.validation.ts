import * as z from "zod";

export const QuizType = {
  FLASHCARD: "FLASHCARD",
  FLASHCARD_REVERSE: "FLASHCARD_REVERSE",
  TYPING: "TYPING",
} as const;

export const LearningMode = {
  CRAM: "CRAM",
  NORMAL: "NORMAL",
  LAZY: "LAZY",
} as const;

export const createDeckSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100),
  quizType: z.nativeEnum(QuizType),
  learningMode: z.nativeEnum(LearningMode),
});
