-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('FLASHCARD', 'FLASHCARD_REVERSE', 'TYPING');

-- CreateEnum
CREATE TYPE "LearningMode" AS ENUM ('CRAM', 'NORMAL', 'LAZY');

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "isRandomOrder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "learningMode" "LearningMode" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "quizType" "QuizType" NOT NULL DEFAULT 'FLASHCARD';
