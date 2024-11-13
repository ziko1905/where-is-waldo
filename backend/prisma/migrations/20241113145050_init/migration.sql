-- CreateTable
CREATE TABLE "Character" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "positionL" INTEGER NOT NULL,
    "positionT" INTEGER NOT NULL,
    "widthPer" INTEGER NOT NULL,
    "heightPer" INTEGER NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");
