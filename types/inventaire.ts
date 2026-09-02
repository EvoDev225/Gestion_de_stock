// types/inventaire.ts

export type StatutInventaire = "EN_COURS" | "VALIDE";

export interface LigneInventaire {
    id: string;
    quantiteTheorique: number;
    quantitePhysique: number;
    ecart: number;
    justification: string | null;
    inventaireId: string;
    produitId: string;
    varianteId: string | null;
    mouvementStockId: string | null;
    produit: {
        id: string;
        nom: string;
        sku: string;
        description: string | null;
        imageUrl: string | null;
        prixAchat: string;
        prixVente: string;
        seuilMinimum: number;
        quantiteStock: number;
        archive: boolean;
        dateCreation: string;
        categorieId: string;
    };
    variante: {
        id: string;
        nomVariante: string;
        skuVariante: string;
        produitId: string;
    } | null;
}

export interface Inventaire {
    id: string;
    dateLancement: string;
    statut: StatutInventaire;
    utilisateurId: string;
    utilisateurValidateurId: string | null;
    dateValidation: string | null;
    lignesInventaire: LigneInventaire[];
}