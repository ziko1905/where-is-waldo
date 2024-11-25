/*
  Warnings:

  - You are about to drop the column `time` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `_CharacterToSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CharacterToSession" DROP CONSTRAINT "_CharacterToSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToSession" DROP CONSTRAINT "_CharacterToSession_B_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "time",
DROP COLUMN "username";

-- DropTable
DROP TABLE "_CharacterToSession";
