import type { Prisma } from "@/generated/prisma/client";

/**
 * Version allégée d'un produit, utilisée uniquement pour peupler une liste
 * de sélection (ex. choix d'un produit dans une commande fournisseur).
 * Ne contient volontairement aucun champ Decimal ni Date, pour pouvoir être
 * transmise sans conversion supplémentaire d'un Server Component vers un
 * Client Component.
 */
export interface ProduitSelection {
    id: string;
    nom: string;
    sku: string;
    variantes: {
        id: string;
        nomVariante: string;
        skuVariante: string;
    }[];
}

/**
 * Le type d'entrée correspond au résultat brut de listerProduits()
 * (lib/services/produit.service.ts), qui retourne les produits avec
 * include: { categorie: true, variantes: true }. On ignore ici tous les champs non
 * nécessaires à une liste de sélection (prix, stock, description, etc.).
 */
type ProduitPrisma = Prisma.ProduitGetPayload<{
    include: {
        categorie: true;
        variantes: { select: { id: true; nomVariante: true; skuVariante: true } };
    };
}>;

export function serialiserProduitPourSelection(produit: ProduitPrisma): ProduitSelection {
    return {
        id: produit.id,
        nom: produit.nom,
        sku: produit.sku,
        variantes: produit.variantes.map((v) => ({
            id: v.id,
            nomVariante: v.nomVariante,
            skuVariante: v.skuVariante,
        })),
    };
}

export function serialiserProduitsPourSelection(produits: ProduitPrisma[]): ProduitSelection[] {
    return produits.map(serialiserProduitPourSelection);
}