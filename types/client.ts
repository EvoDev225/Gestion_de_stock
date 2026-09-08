export interface Client {
    id: string;
    nom: string;
    telephone: string;
    email: string | null;
    adresse: string | null;
    _count?: {
        ventes: number;
    };
}

export interface ClientAvecVentes extends Client {
    ventes: VenteResume[];
}

export interface VenteResume {
    id: string;
    dateVente: string;
    montantTotal: string;
    statut: string;
    modePaiement: string;
}

export interface ClientFormData {
    nom: string;
    telephone: string;
    email?: string;
    adresse?: string;
}