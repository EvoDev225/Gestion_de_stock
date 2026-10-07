import type { CommandeFournisseur, StatutCommande } from "@/types/commande-fournisseur";

/**
 * Forme brute d'une ligne de commande telle que renvoyée par les services
 * (listing ou détail). Les champs optionnels correspondent aux données
 * présentes uniquement sur le détail (quantiteRecue) ou quand la relation
 * variante est chargée.
 */
interface LigneCommandeBrute {
    id: string;
    quantiteCommande: number;
    prixAchatUnitaire: unknown;
    quantiteRecue?: number;
    commandeFournisseurId: string;
    produitId: string;
    produit: {
        id: string;
        nom: string;
        sku: string;
    };
    varianteId?: string | null;
    variante?: {
        id: string;
        nomVariante: string;
        skuVariante: string;
    } | null;
}

/**
 * Forme brute d'une commande telle que renvoyée par les services.
 * `ligneCommandeFournisseur` est optionnel pour rester tolérant si la
 * relation n'est pas incluse dans la requête Prisma.
 */
interface CommandeBrute {
    id: string;
    dateCommande: Date;
    statut: StatutCommande;
    fournisseurId: string;
    utilisateurId: string;
    fournisseur: {
        id: string;
        nom: string;
        email: string | null;
        telephone: string;
        adresse: string;
    };
    ligneCommandeFournisseur?: LigneCommandeBrute[];
}

export function serialiserCommande(commande: CommandeBrute): CommandeFournisseur {
    return {
        id: commande.id,
        dateCommande: commande.dateCommande.toISOString(),
        statut: commande.statut,
        fournisseurId: commande.fournisseurId,
        utilisateurId: commande.utilisateurId,
        fournisseur: {
            id: commande.fournisseur.id,
            nom: commande.fournisseur.nom,
            email: commande.fournisseur.email,
            telephone: commande.fournisseur.telephone,
            adresse: commande.fournisseur.adresse,
        },
        ligneCommandeFournisseur: (commande.ligneCommandeFournisseur ?? []).map((ligne) => ({
            id: ligne.id,
            quantiteCommande: Number(ligne.quantiteCommande),
            prixAchatUnitaire: Number(ligne.prixAchatUnitaire),
            quantiteRecue: ligne.quantiteRecue ?? undefined,
            commandeFournisseurId: ligne.commandeFournisseurId,
            produitId: ligne.produitId,
            produit: {
                id: ligne.produit.id,
                nom: ligne.produit.nom,
                sku: ligne.produit.sku,
            },
            varianteId: ligne.varianteId ?? null,
            variante: ligne.variante
                ? {
                    id: ligne.variante.id,
                    nomVariante: ligne.variante.nomVariante,
                    skuVariante: ligne.variante.skuVariante,
                }
                : null,
        })),
    };
}

export function serialiserCommandes(commandes: CommandeBrute[]): CommandeFournisseur[] {
    return commandes.map(serialiserCommande);
}