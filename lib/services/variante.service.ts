import { prisma } from "@/lib/prisma";

export async function listerVariantes(produitId?: string) {
    return prisma.variante.findMany({
        where: produitId ? { produitId } : undefined,
        include: { produit: true },
        orderBy: { nomVariante: "asc" },
    });
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