/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sid` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "sid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Player_sid_key" ON "Player"("sid");
