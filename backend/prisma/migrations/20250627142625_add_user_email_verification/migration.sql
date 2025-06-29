-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiresTime" TIMESTAMP(3),
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationCode" TEXT;
