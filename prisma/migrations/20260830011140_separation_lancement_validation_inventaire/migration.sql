-- AlterTable
ALTER TABLE "Inventaire" ADD COLUMN     "dateValidation" TIMESTAMP(3),
ADD COLUMN     "utilisateurValidateurId" TEXT;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_utilisateurValidateurId_fkey" FOREIGN KEY ("utilisateurValidateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
