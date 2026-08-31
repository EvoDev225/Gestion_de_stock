import { prisma } from "@/lib/prisma"; // ⚠️ adapte le chemin d'import selon ton projet

export async function listerMouvementsStock(params?: {
    produitId?: string;
    varianteId?: string;
}) {
    return prisma.mouvementStock.findMany({
        where: {
            ...(params?.produitId ? { produitId: params.produitId } : {}),
            ...(params?.varianteId ? { varianteId: params.varianteId } : {}),
        },
        include: {
            produit: { select: { id: true, nom: true, sku: true } },
            variante: { select: { id: true, nomVariante: true } },
            lot: { select: { id: true, numeroLot: true } },
            utilisateur: { select: { id: true, nom: true, email: true } },
        },
        orderBy: { dateMouvement: "desc" },
    });
}