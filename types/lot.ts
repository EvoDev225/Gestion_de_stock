export interface Lot {
    id: string;
    numeroLot: string;
    dateExpiration: string;
    quantite: number;
    dateReception: string;
    produitId?: string | null;
    varianteId?: string | null;
    produit?: { id: string; nom: string; sku: string } | null;
    _count?: { mouvementsStock: number };
    variante?: {
        id: string;
        nomVariante: string;
        skuVariante: string;
        produit?: { id: string; nom: string; sku: string } | null;
         // 👈 ajouté
    } | null;
}