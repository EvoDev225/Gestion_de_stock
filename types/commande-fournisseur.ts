export interface Fournisseur {
    id: string;
    nom: string;
    email: string | null;
    telephone: string;
    adresse: string;
}

export interface Produit {
    id: string;
    nom: string;
    sku: string;
}

export interface LigneCommandeFournisseur {
    id: string;
    quantiteCommande: number;
    prixAchatUnitaire: number;
    quantiteRecue?: number; // présent uniquement sur le détail (obtenirCommandeFournisseurParId), absent du listing
    commandeFournisseurId: string;
    produitId: string;
    produit: Produit;
}

export type StatutCommande = "EN_ATTENTE" | "ENVOYEE" | "RECUE_PARTIELLE" | "RECUE";

export interface CommandeFournisseur {
    id: string;
    dateCommande: string;
    statut: StatutCommande;
    fournisseurId: string;
    utilisateurId: string;
    fournisseur: Fournisseur;
    ligneCommandeFournisseur: LigneCommandeFournisseur[];
}

export interface NouvelleLigneCommandeData {
    produitId: string;
    quantiteCommande: number;
    prixAchatUnitaire: number;
}