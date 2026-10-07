-- AlterTable
ALTER TABLE "LigneCommandeFournisseur" ADD COLUMN     "varianteId" TEXT;

-- AddForeignKey
ALTER TABLE "LigneCommandeFournisseur" ADD CONSTRAINT "LigneCommandeFournisseur_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
