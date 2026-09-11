-- AlterTable
ALTER TABLE "LigneRetour" ADD COLUMN     "lotId" TEXT;

-- AddForeignKey
ALTER TABLE "LigneRetour" ADD CONSTRAINT "LigneRetour_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
