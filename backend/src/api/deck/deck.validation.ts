import { z } from "zod";
import { QuizType, LearningMode } from "@generated/prisma";

export const createDeckSchema = z.object({
    body: z.object({
        title: z.string({required_error: "Deck name is required"}).min(1, {message: "Deck name cannot be empty."}).max(255),
        quizType: z.nativeEnum(QuizType).optional(),
        learningMode: z.nativeEnum(LearningMode).optional(),
        isRandomOrder: z.boolean().optional()
    })
})

export const updateDeckSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Deck name cannot be empty.").max(255).optional(),
        quizType: z.nativeEnum(QuizType).optional(),
        learningMode: z.nativeEnum(LearningMode).optional(),
        isRandomOrder: z.boolean().optional()
    })
})


