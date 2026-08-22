-- CreateEnum
CREATE TYPE "StatutInventaire" AS ENUM ('EN_COURS', 'VALIDE');

-- CreateTable
CREATE TABLE "Inventaire" (
    "id" TEXT NOT NULL,
    "dateLancement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutInventaire" NOT NULL DEFAULT 'EN_COURS',
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "Inventaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LigneInventaire" (
    "id" TEXT NOT NULL,
    "quantiteTheorique" INTEGER NOT NULL,
    "quantitePhysique" INTEGER NOT NULL,
    "ecart" INTEGER NOT NULL,
    "justification" TEXT,
    "inventaireId" TEXT NOT NULL,
    "produitId" TEXT NOT NULL,
    "varianteId" TEXT,
    "mouvementStockId" TEXT,

    CONSTRAINT "LigneInventaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalActivite" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entiteConcerneeType" TEXT,
    "entiteConcerneeId" TEXT,
    "details" TEXT,
    "dateAction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "JournalActivite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LigneInventaire_mouvementStockId_key" ON "LigneInventaire"("mouvementStockId");

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneInventaire" ADD CONSTRAINT "LigneInventaire_inventaireId_fkey" FOREIGN KEY ("inventaireId") REFERENCES "Inventaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneInventaire" ADD CONSTRAINT "LigneInventaire_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneInventaire" ADD CONSTRAINT "LigneInventaire_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "Variante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LigneInventaire" ADD CONSTRAINT "LigneInventaire_mouvementStockId_fkey" FOREIGN KEY ("mouvementStockId") REFERENCES "MouvementStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalActivite" ADD CONSTRAINT "JournalActivite_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
