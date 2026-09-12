import type { Prisma } from "@/generated/prisma/client";
import type { CommandeFournisseur } from "@/types/commande-fournisseur";

/**
 * Type d'entrée correspondant au résultat brut de listerCommandesFournisseur()
 * et de creerCommandeFournisseur() (lib/services/commande-fournisseur.service.ts),
 * qui incluent fournisseur et ligneCommandeFournisseur (avec le produit imbriqué).
 */
type CommandeFournisseurPrisma = Prisma.CommandeFournisseurGetPayload<{
    include: {
        fournisseur: true;
        ligneCommandeFournisseur: { include: { produit: true } };
    };
}>;

type LigneCommandeFournisseurPrisma = CommandeFournisseurPrisma["ligneCommandeFournisseur"][number];

export function serialiserCommande(commande: CommandeFournisseurPrisma): CommandeFournisseur {
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
        ligneCommandeFournisseur: commande.ligneCommandeFournisseur.map(serialiserLigneCommande),
    };
}

function serialiserLigneCommande(ligne: LigneCommandeFournisseurPrisma) {
    return {
        id: ligne.id,
        quantiteCommande: Number(ligne.quantiteCommande),
        prixAchatUnitaire: Number(ligne.prixAchatUnitaire),
        commandeFournisseurId: ligne.commandeFournisseurId,
        produitId: ligne.produitId,
        // Le produit imbriqué contient des champs Decimal (prixAchat, prixVente)
        // non sérialisables vers un Client Component : on ne garde que id/nom/sku,
        // seuls champs réellement consommés par CommandesTable/CommandeCard.
        produit: {
            id: ligne.produit.id,
            nom: ligne.produit.nom,
            sku: ligne.produit.sku,
        },
    };
}

export function serialiserCommandes(commandes: CommandeFournisseurPrisma[]): CommandeFournisseur[] {
    return commandes.map(serialiserCommande);
}