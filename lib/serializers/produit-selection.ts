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
 * Le type d'entrée est volontairement minimal : il décrit uniquement les
 * champs lus ici. Ainsi, tout résultat de listerProduits() est accepté
 * (avec ou sans include des variantes), sans dépendre du type généré par
 * Prisma. Les champs non nécessaires à une liste de sélection (prix, stock,
 * description, etc.) sont ignorés.
 */
interface ProduitSource {
    id: string;
    nom: string;
    sku: string;
    variantes?: {
        id: string;
        nomVariante: string;
        skuVariante: string;
    }[];
}

export function serialiserProduitPourSelection(produit: ProduitSource): ProduitSelection {
    return {
        id: produit.id,
        nom: produit.nom,
        sku: produit.sku,
        variantes: (produit.variantes ?? []).map((v) => ({
            id: v.id,
            nomVariante: v.nomVariante,
            skuVariante: v.skuVariante,
        })),
    };
}

export function serialiserProduitsPourSelection(produits: ProduitSource[]): ProduitSelection[] {
    return produits.map(serialiserProduitPourSelection);
}