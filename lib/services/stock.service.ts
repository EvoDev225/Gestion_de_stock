import { prisma } from "@/lib/prisma";

/**
 * Stock réel d'une variante : toujours Σ de ses lots.
 * Aucun champ dénormalisé n'existe sur Variante — jamais existé.
 */
export async function calculerStockVariante(varianteId: string) {
    const resultat = await prisma.lot.aggregate({
        _sum: { quantite: true },
        where: { varianteId },
    });
    return resultat._sum.quantite ?? 0;
}

/**
 * Stock réel d'un produit :
 * - s'il a des variantes → Σ des lots de TOUTES ses variantes
 * - sinon → Σ de ses propres lots directs
 * Produit.quantiteStock n'est plus une source de vérité fiable
 * (jamais synchronisé par lot.service.ts) : on ne le lit plus jamais.
 */
export async function calculerStockProduit(produitId: string) {
    const produit = await prisma.produit.findUnique({
        where: { id: produitId },
        include: { variantes: true },
    });
    if (!produit) return null;

    if (produit.variantes.length > 0) {
        const resultat = await prisma.lot.aggregate({
            _sum: { quantite: true },
            where: { varianteId: { in: produit.variantes.map((v) => v.id) } },
        });
        return resultat._sum.quantite ?? 0;
    }

    const resultat = await prisma.lot.aggregate({
        _sum: { quantite: true },
        where: { produitId },
    });
    return resultat._sum.quantite ?? 0;
}

/**
 * Version batch pour une liste de produits (ex: ProductsTable) —
 * 2 requêtes groupBy au total, jamais une agrégation par produit.
 */
export async function calculerStockPourListeProduits(
    produits: { id: string; variantes: { id: string }[] }[]
) {
    const [sommeParProduit, sommeParVariante] = await Promise.all([
        prisma.lot.groupBy({
            by: ["produitId"],
            _sum: { quantite: true },
            where: { produitId: { not: null } },
        }),
        prisma.lot.groupBy({
            by: ["varianteId"],
            _sum: { quantite: true },
            where: { varianteId: { not: null } },
        }),
    ]);

    const stockParProduitId = new Map(
        sommeParProduit.map((s) => [s.produitId as string, s._sum.quantite ?? 0])
    );
    const stockParVarianteId = new Map(
        sommeParVariante.map((s) => [s.varianteId as string, s._sum.quantite ?? 0])
    );

    return new Map(
        produits.map((produit) => [
            produit.id,
            produit.variantes.length > 0
                ? produit.variantes.reduce(
                    (total, v) => total + (stockParVarianteId.get(v.id) ?? 0),
                    0
                )
                : stockParProduitId.get(produit.id) ?? 0,
        ])
    );
}