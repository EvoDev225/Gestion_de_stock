/*
  Warnings:

  - A unique constraint covering the columns `[numeroLot]` on the table `Lot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lot_numeroLot_key" ON "Lot"("numeroLot");
