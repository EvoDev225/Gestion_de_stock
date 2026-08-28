-- CreateEnum
CREATE TYPE "ModePaiement" AS ENUM ('TOTAL', 'CREDIT');

-- AlterTable
ALTER TABLE "Vente" ADD COLUMN     "modePaiement" "ModePaiement" NOT NULL DEFAULT 'TOTAL';
