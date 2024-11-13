-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "time" INTEGER,
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'Anonymus';

-- CreateTable
CREATE TABLE "_CharacterToSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToSession_AB_unique" ON "_CharacterToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToSession_B_index" ON "_CharacterToSession"("B");

-- AddForeignKey
ALTER TABLE "_CharacterToSession" ADD CONSTRAINT "_CharacterToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToSession" ADD CONSTRAINT "_CharacterToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
