import { prisma } from "@/lib/prisma";
import { calculerStockPourListeProduits } from "./stock.service";

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
  sku: string;
  description?: string;
  prixAchat: number;
  prixVente: number;
  seuilMinimum?: number;
  categorieId?: string;
}) {
  return prisma.produit.create({
    data,
    include: { categorie: true },
  });
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