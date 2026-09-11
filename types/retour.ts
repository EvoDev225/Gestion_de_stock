export type TypeRetour = "CLIENT" | "FOURNISSEUR";

export interface LigneRetour {
    id: string;
    quantite: number;
    produitId: string;
    varianteId: string | null;
    lotId: string | null;
    ligneVenteId: string | null;
    produit: {
        id: string;
        nom: string;
        sku: string;
    };
    variante: {
        id: string;
        nomVariante: string;
        skuVariante: string;
    } | null;
    lot: {
        id: string;
        numeroLot: string;
    } | null;
}

export interface Retour {
    id: string;
    typeRetour: TypeRetour;
    dateRetour: string;
    motif: string | null;
    venteId: string | null;
    commandeFournisseurId: string | null;
    utilisateurId: string;
    lignesRetour: LigneRetour[];
    vente: {
        id: string;
        dateVente: string;
        montantTotal: string;
        statut: string;
        modePaiement: string;
    } | null;
    commandeFournisseur: {
        id: string;
        dateCommande: string;
        statut: string;
    } | null;
    utilisateur: {
        id: string;
        nom: string;
    };
}