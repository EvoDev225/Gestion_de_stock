export interface Fournisseur {
    id: string;
    nom: string;
    email: string | null;
    telephone: string;
    adresse: string;
    _count?: { commandeFournisseurs: number };
}

export interface FournisseurFormData {
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
}