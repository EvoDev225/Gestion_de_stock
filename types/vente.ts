export interface VenteProduitResume {
    id: string;
    nom: string;
    sku: string;
}

export interface VenteVarianteResume {
    id: string;
    nomVariante: string;
    skuVariante: string;
}

export interface VenteLotResume {
    id: string;
    numeroLot: string;
    dateExpiration: string | null;
}

export interface VenteClientResume {
    id: string;
    nom: string;
    telephone: string;
}

export interface VenteUtilisateurResume {
    id: string;
    nom: string;
}

export interface LigneVente {
    id: string;
    quantite: number;
    prixUnitaire: string;
    stockInsuffisantConfirme: boolean;
    produitId: string;
    varianteId: string | null;
    lotId: string | null;
    produit: VenteProduitResume;
    variante?: VenteVarianteResume;
    lot?: VenteLotResume;
}

export interface Vente {
    id: string;
    dateVente: string;
    montantTotal: string;
    statut: "VALIDEE" | "ANNULEE";
    modePaiement: "TOTAL" | "CREDIT";
    clientId: string | null;
    utilisateurId: string;
    client?: VenteClientResume;
    utilisateur?: VenteUtilisateurResume;
    ligneVentes: LigneVente[];
}