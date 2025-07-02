import { QuizType, LearningMode } from "@generated/prisma";

export interface ICreateDeck {
    title: string;
    quizType?: QuizType;
    learningMode?: LearningMode;
}

export interface IUpdateCheck {
    title?: string,
    quizType?: QuizType,
    learningMode?: LearningMode,
    isRandomOrder?: boolean
} 