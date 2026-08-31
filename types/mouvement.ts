export type TypeMouvement = "ENTREE" | "SORTIE" | "AJUSTEMENT" | "PERTE" | "DOMMAGE" ; // à compléter selon l'enum réel

export interface MouvementStock {
    id: string;
    typeMouvement: TypeMouvement;
    quantite: number;
    motif?: string | null;
    dateMouvement: string;
    utilisateurId: string;
    utilisateur?: { id: string; nom?: string; email?: string } | null;
    produitId: string;
    produit?: { id: string; nom: string; sku: string } | null;
    varianteId?: string | null;
    variante?: { id: string; nomVariante: string } | null;
    lotId?: string | null;
    lot?: { id: string; numeroLot: string } | null;
}