import { prisma } from "@/lib/prisma";

export async function listerVariantes(produitId?: string) {
    const variantes = await prisma.variante.findMany({
        where: produitId ? { produitId } : undefined,
        include: { produit: true },
        orderBy: { nomVariante: "asc" },
    });

    if (variantes.length === 0) return variantes;

    const sommeParVariante = await prisma.lot.groupBy({
        by: ["varianteId"],
        _sum: { quantite: true },
        where: { varianteId: { in: variantes.map((v) => v.id) } },
    });

    const stockParVarianteId = new Map(
        sommeParVariante.map((s) => [s.varianteId as string, s._sum.quantite ?? 0])
    );

    return variantes.map((v) => ({
        ...v,
        stockCalcule: stockParVarianteId.get(v.id) ?? 0,
    }));
}

export async function obtenirVarianteParId(id: string) {
    return prisma.variante.findUnique({
        where: { id },
        include: { produit: true },
    });
}

export async function creerVariante(data: {
    nomVariante: string;
    skuVariante: string;
    produitId: string;
}) {
    return prisma.variante.create({
        data,
        include: { produit: true },
    });
}

export async function modifierVariante(
    id: string,
    data: { nomVariante?: string; skuVariante?: string }
) {
    return prisma.variante.update({
        where: { id },
        data,
    });
}

export async function supprimerVariante(id: string) {
    return prisma.variante.delete({ where: { id } });
}