import { prisma } from "@/lib/prisma";

export async function listerProduits() {
    return prisma.produit.findMany({
        include: { categorie: true },
        orderBy: { nom: "asc" },
    });
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
  return prisma.produit.update({
    where: { id },
    data,
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