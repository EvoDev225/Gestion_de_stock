export interface LigneReception {
    id: string;
    quantiteRecue: number;
    receptionFournisseurId: string;
    ligneCommandeFournisseurId: string;
    ligneCommandeFournisseur: {
        id: string;
        quantiteCommande: number;
        prixAchatUnitaire: string;
        produit: {
            id: string;
            nom: string;
            sku: string;
        };
    };
}

export interface ReceptionFournisseur {
    id: string;
    dateReception: string;
    commandeFournisseurId: string;
    utilisateurId: string;
    lignesReception: LigneReception[];
    commandeFournisseur?: {
        id: string;
        fournisseur: { id: string; nom: string };
        statut: string;
    };
    utilisateur?: {
        id: string;
        nom: string;
        prenom: string;
    };
}

export interface LigneRestante {
    ligneCommandeFournisseurId: string;
    produitNom: string;
    produitSku: string;
    quantiteCommande: number;
    quantiteDejaRecue: number;
    quantiteRestante: number;
}