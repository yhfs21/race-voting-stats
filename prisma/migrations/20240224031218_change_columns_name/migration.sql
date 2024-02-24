/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `votedAt` on the `Result` table. All the data in the column will be lost.
  - Added the required column `voted_at` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "createdAt",
DROP COLUMN "votedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "voted_at" TIMESTAMP(3) NOT NULL;
