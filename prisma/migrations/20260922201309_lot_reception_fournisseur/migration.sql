-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "receptionFournisseurId" TEXT;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_receptionFournisseurId_fkey" FOREIGN KEY ("receptionFournisseurId") REFERENCES "ReceptionFournisseur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
