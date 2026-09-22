import { prisma } from "@/lib/prisma";
import { calculerStockPourListeProduits } from "./stock.service";
import { Prisma } from "@/generated/prisma/client";
const MOTS_IGNORES = new Set(["de", "du", "des", "la", "le", "les", "un", "une", "et", "à"]);

function extraireInitiales(nom: string): string {
  const mots = nom
    .trim()
    .split(/\s+/)
    .filter((mot) => mot.length > 0 && !MOTS_IGNORES.has(mot.toLowerCase()));
  const initiales = mots.map((mot) => mot[0].toUpperCase()).join("");
  return initiales.slice(0, 3) || "PRD";
}

async function genererSkuProduit(nom: string): Promise<string> {
  const base = extraireInitiales(nom);
  const existants = await prisma.produit.count({
    where: { sku: { startsWith: `${base}-` } },
  });
  return `${base}-${String(existants + 1).padStart(4, "0")}`;
}
export async function listerProduits() {
    return prisma.produit.findMany({
        include: { categorie: true },
        orderBy: { nom: "asc" },
    });
}

export async function listerProduitsAvecStock() {
    const produits = await prisma.produit.findMany({
        include: { categorie: true, variantes: true },
        orderBy: { nom: "asc" },
    });

    const stockParId = await calculerStockPourListeProduits(produits);

    return produits.map((produit) => ({
        ...produit,
        stockCalcule: stockParId.get(produit.id) ?? 0,
    }));
}

export async function obtenirProduitParId(id: string) {
  return prisma.produit.findUnique({
    where: { id },
    include: { categorie: true },
  });
}


export async function creerProduit(data: {
  nom: string;
  description?: string;
  prixAchat: number;
  prixVente: number;
  seuilMinimum?: number;
  categorieId?: string;
}) {
  const sku = await genererSkuProduit(data.nom);
  try {
    return await prisma.produit.create({
      data: { ...data, sku },
      include: { categorie: true },
    });
  } catch (erreur) {
    if (erreur instanceof Prisma.PrismaClientKnownRequestError && erreur.code === "P2002") {
      const skuRetry = await genererSkuProduit(data.nom);
      return prisma.produit.create({ data: { ...data, sku: skuRetry }, include: { categorie: true } });
    }
    throw erreur;
  }
}

export async function modifierProduit(
  id: string,
  data: {
    nom?: string;
    sku?: string;
    description?: string;
    prixAchat?: number;
    prixVente?: number;
    seuilMinimum?: number;
    categorieId?: string;
  }
) {
  const { nom, sku, description, prixAchat, prixVente, seuilMinimum, categorieId } = data;
  return prisma.produit.update({
    where: { id },
    data: { nom, sku, description, prixAchat, prixVente, seuilMinimum, categorieId },
    include: { categorie: true },
  });
}

export async function archiverProduit(id: string) {
  return prisma.produit.update({
    where: { id },
    data: { archive: true },
  });
}
export async function desarchiverProduit(id: string) {
    return prisma.produit.update({
        where: { id },
        data: { archive: false },
    });
}