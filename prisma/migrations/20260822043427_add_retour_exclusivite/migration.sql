/*
  Warnings:

  - You are about to drop the column `variantId` on the `MouvementStock` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TypeRetour" AS ENUM ('CLIENT', 'FOURNISSEUR');

-- CreateEnum
CREATE TYPE "StatutVente" AS ENUM ('VALIDEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'ENVOYEE', 'RECUE_PARTIELLE', 'RECUE');

-- DropForeignKey
ALTER TABLE "MouvementStock" DROP CONSTRAINT "MouvementStock_variantId_fkey";

-- AlterTable
ALTER TABLE "MouvementStock" DROP COLUMN "variantId",
ADD COLUMN     "varianteId" TEXT;

-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "actif" SET DEFAULT true;

-- CreateTable
CREATE TABLE "Vente" (
    "id" TEXT NOT NULL,
    "dateVente" TIMESTAMP(3) NOT NULL,
    "montantTotal" DECIMAL(10,2) NOT NULL,
    "statut" "StatutVente" NOT NULL DEFAULT 'VALIDEE',
    "clientId" TEXT,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "Vente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneVente" (
    "id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DECIMAL(10,2) NOT NULL,
    "venteId" TEXT NOT NULL,
    "produitId" TEXT NOT NULL,

    CONSTRAINT "LigneVente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandeFournisseur" (
    "id" TEXT NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "fournisseurId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "CommandeFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneCommandeFournisseur" (
    "id" TEXT NOT NULL,
    "quantiteCommande" INTEGER NOT NULL,
    "prixAchatUnitaire" DECIMAL(10,2) NOT NULL,
    "commandeFournisseurId" TEXT NOT NULL,
    "produitId" TEXT NOT NULL,

    CONSTRAINT "LigneCommandeFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceptionFournisseur" (
    "id" TEXT NOT NULL,
    "dateReception" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commandeFournisseurId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "ReceptionFournisseur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneReception" (
    "id" TEXT NOT NULL,
    "quantiteRecue" INTEGER NOT NULL,
    "receptionFournisseurId" TEXT NOT NULL,
    "ligneCommandeFournisseurId" TEXT NOT NULL,

    CONSTRAINT "LigneReception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Retour" (
    "id" TEXT NOT NULL,
    "typeRetour" "TypeRetour" NOT NULL,
    "dateRetour" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motif" TEXT,
    "venteId" TEXT,
    "commandeFournisseurId" TEXT,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "Retour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneRetour" (
    "id" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "retourId" TEXT NOT NULL,
    "produitId" TEXT NOT NULL,
    "varianteId" TEXT,

    CONSTRAINT "LigneRetour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MouvementStock" ADD CONSTRAINT "MouvementStock_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vente" ADD CONSTRAINT "Vente_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneVente" ADD CONSTRAINT "LigneVente_venteId_fkey" FOREIGN KEY ("venteId") REFERENCES "Vente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneVente" ADD CONSTRAINT "LigneVente_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandeFournisseur" ADD CONSTRAINT "CommandeFournisseur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandeFournisseur" ADD CONSTRAINT "CommandeFournisseur_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommandeFournisseur" ADD CONSTRAINT "LigneCommandeFournisseur_commandeFournisseurId_fkey" FOREIGN KEY ("commandeFournisseurId") REFERENCES "CommandeFournisseur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneCommandeFournisseur" ADD CONSTRAINT "LigneCommandeFournisseur_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionFournisseur" ADD CONSTRAINT "ReceptionFournisseur_commandeFournisseurId_fkey" FOREIGN KEY ("commandeFournisseurId") REFERENCES "CommandeFournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceptionFournisseur" ADD CONSTRAINT "ReceptionFournisseur_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneReception" ADD CONSTRAINT "LigneReception_receptionFournisseurId_fkey" FOREIGN KEY ("receptionFournisseurId") REFERENCES "ReceptionFournisseur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneReception" ADD CONSTRAINT "LigneReception_ligneCommandeFournisseurId_fkey" FOREIGN KEY ("ligneCommandeFournisseurId") REFERENCES "LigneCommandeFournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retour" ADD CONSTRAINT "Retour_venteId_fkey" FOREIGN KEY ("venteId") REFERENCES "Vente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retour" ADD CONSTRAINT "Retour_commandeFournisseurId_fkey" FOREIGN KEY ("commandeFournisseurId") REFERENCES "CommandeFournisseur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Retour" ADD CONSTRAINT "Retour_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneRetour" ADD CONSTRAINT "LigneRetour_retourId_fkey" FOREIGN KEY ("retourId") REFERENCES "Retour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneRetour" ADD CONSTRAINT "LigneRetour_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneRetour" ADD CONSTRAINT "LigneRetour_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
