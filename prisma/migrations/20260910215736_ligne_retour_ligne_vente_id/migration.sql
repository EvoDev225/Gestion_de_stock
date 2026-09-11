-- AlterTable
ALTER TABLE "LigneRetour" ADD COLUMN     "ligneVenteId" TEXT;

-- AddForeignKey
ALTER TABLE "LigneRetour" ADD CONSTRAINT "LigneRetour_ligneVenteId_fkey" FOREIGN KEY ("ligneVenteId") REFERENCES "LigneVente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
