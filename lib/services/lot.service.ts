import { prisma } from "@/lib/prisma";

export async function genererNumeroLot(): Promise<string> {
  const total = await prisma.lot.count();
  return `LOT-${String(total + 1).padStart(5, "0")}`;
}
export async function listerLots(
    produitId?: string,
    varianteId?: string,
    commandeFournisseurId?: string
) {
    return prisma.lot.findMany({
        where: {
            ...(produitId && { produitId }),
            ...(varianteId && { varianteId }),
            ...(commandeFournisseurId && {
                receptionFournisseur: { commandeFournisseurId },
            }),
        },
        include: {
            produit: true,
            variante: {
                include: {
                    produit: true,
                },
            },
            _count: {
                select: { mouvementStocks: true },
            },
        },
        orderBy: { dateExpiration: "asc" },
    });
}


export async function obtenirLotParId(id: string) {
    return prisma.lot.findUnique({
        where: { id },
        include: {
            produit: true,
            variante: {
                include: {
                    produit: true,
                },
            },
        },
    });
}

export async function creerLot(data: {
  dateExpiration?: Date;
  quantite: number;
  dateReception: Date;
  produitId?: string;
  varianteId?: string;
}) {
  const cibleProduit = Boolean(data.produitId);
  const cibleVariante = Boolean(data.varianteId);
  if (cibleProduit === cibleVariante) {
    throw new Error("Un lot doit être rattaché à exactement un produit OU une variante, jamais les deux ni aucun");
  }
  const numeroLot = await genererNumeroLot();
  return prisma.lot.create({
    data: { ...data, numeroLot },
    include: { produit: true, variante: { include: { produit: true } } },
  });
}

export async function modifierLot(
    id: string,
    data: { numeroLot?: string; dateExpiration?: Date; quantite?: number }
) {
    return prisma.lot.update({
        where: { id },
        data,
        include: {
            produit: true,
            variante: {
                include: {
                    produit: true,
                },
            },
        },
    });
}

export async function supprimerLot(id: string) {
    return prisma.lot.delete({ where: { id } });
}