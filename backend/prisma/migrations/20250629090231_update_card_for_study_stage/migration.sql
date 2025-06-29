/*
  Warnings:

  - You are about to drop the column `easeFactor` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `repetitions` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "easeFactor",
DROP COLUMN "interval",
DROP COLUMN "repetitions",
ADD COLUMN     "studyStage" INTEGER NOT NULL DEFAULT 0;
