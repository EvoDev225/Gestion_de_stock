export interface Categorie {
    id: string;
    nom: string;
    description?: string | null;
}

export interface Produit {
    id: string;
    nom: string;
    sku: string;
    description?: string | null;
    imageUrl?: string | null;
    prixAchat: string; // Decimal Prisma sérialisé en string via JSON
    prixVente: string;
    seuilMinimum: number;
    quantiteStock: number;
    archive: boolean;
    dateCreation: string;
    categorieId?: string | null;
    categorie?: Categorie | null;
}

export interface Variante {
    id: string;
    nomVariante: string;
    skuVariante: string;
    produitId: string;
    stockCalcule?: number; // dérivé des Lot associés, calculé côté API ou client
}

export type StatutFiltre = "tous" | "actifs" | "archives";
export type VueAffichage = "table" | "grille";