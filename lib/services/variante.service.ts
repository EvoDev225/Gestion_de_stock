import { prisma } from "@/lib/prisma";
async function genererSkuVariante(produitId: string): Promise<string> {
  const produit = await prisma.produit.findUnique({ where: { id: produitId }, select: { sku: true } });
  if (!produit) throw new Error("Produit introuvable");
  const existantes = await prisma.variante.count({ where: { produitId } });
  return `${produit.sku}-${String(existantes + 1).padStart(2, "0")}`;
}
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

export async function creerVariante(data: { nomVariante: string; produitId: string }) {
  const skuVariante = await genererSkuVariante(data.produitId);
  return prisma.variante.create({
    data: { ...data, skuVariante },
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