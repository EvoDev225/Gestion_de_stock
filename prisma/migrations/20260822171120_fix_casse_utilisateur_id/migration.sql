/*
  Warnings:

  - You are about to drop the column `utilisateurID` on the `MouvementStock` table. All the data in the column will be lost.
  - Added the required column `utilisateurId` to the `MouvementStock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MouvementStock" DROP CONSTRAINT "MouvementStock_utilisateurID_fkey";

-- AlterTable
ALTER TABLE "MouvementStock" DROP COLUMN "utilisateurID",
ADD COLUMN     "utilisateurId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
