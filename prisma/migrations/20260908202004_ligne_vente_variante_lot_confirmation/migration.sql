-- AlterTable
ALTER TABLE "LigneVente" ADD COLUMN     "lotId" TEXT,
ADD COLUMN     "stockInsuffisantConfirme" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "varianteId" TEXT;

-- AddForeignKey
ALTER TABLE "LigneVente" ADD CONSTRAINT "LigneVente_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneVente" ADD CONSTRAINT "LigneVente_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
