export type TypeMouvement = "ENTREE" | "SORTIE" | "AJUSTEMENT" | "PERTE" | "DOMMAGE";

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

interface TypeMouvementConfig {
    label: string;
    badgeClass: string;
}

export const TYPE_MOUVEMENT_CONFIG: Record<TypeMouvement, TypeMouvementConfig> = {
    ENTREE: { label: "Entrée", badgeClass: "bg-primary/10 text-primary" },
    SORTIE: { label: "Sortie", badgeClass: "bg-blue-500/10 text-blue-600" },
    AJUSTEMENT: { label: "Ajustement", badgeClass: "bg-amber-500/10 text-amber-600" },
    PERTE: { label: "Perte", badgeClass: "bg-destructive/10 text-destructive" },
    DOMMAGE: { label: "Dommage", badgeClass: "bg-destructive/10 text-destructive" },
};