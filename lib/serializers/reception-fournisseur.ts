import { Prisma } from "../../generated/prisma/client";
import type { ReceptionFournisseur as ReceptionFournisseurType } from "@/types/reception-fournisseur";

type ReceptionFournisseurAvecRelations = Prisma.ReceptionFournisseurGetPayload<{
    include: {
        lignesReception: {
            include: {
                ligneCommandeFournisseur: {
                    include: { produit: true };
                };
            };
        };
        commandeFournisseur: { include: { fournisseur: true } };
        utilisateur: true;
    };
}>;

export function serialiserReception(
    reception: ReceptionFournisseurAvecRelations
): ReceptionFournisseurType {
    return {
        id: reception.id,
        dateReception: reception.dateReception.toISOString(),
        commandeFournisseurId: reception.commandeFournisseurId,
        utilisateurId: reception.utilisateurId,
        lignesReception: reception.lignesReception.map((ligne) => ({
            id: ligne.id,
            quantiteRecue: ligne.quantiteRecue,
            receptionFournisseurId: ligne.receptionFournisseurId,
            ligneCommandeFournisseurId: ligne.ligneCommandeFournisseurId,
            ligneCommandeFournisseur: {
                id: ligne.ligneCommandeFournisseur.id,
                quantiteCommande: ligne.ligneCommandeFournisseur.quantiteCommande,
                prixAchatUnitaire: ligne.ligneCommandeFournisseur.prixAchatUnitaire.toString(),
                produit: {
                    id: ligne.ligneCommandeFournisseur.produit.id,
                    nom: ligne.ligneCommandeFournisseur.produit.nom,
                    sku: ligne.ligneCommandeFournisseur.produit.sku,
                },
            },
        })),
        commandeFournisseur: reception.commandeFournisseur
            ? {
                id: reception.commandeFournisseur.id,
                fournisseur: {
                    id: reception.commandeFournisseur.fournisseur.id,
                    nom: reception.commandeFournisseur.fournisseur.nom,
                },
                statut: reception.commandeFournisseur.statut,
            }
            : undefined,
        utilisateur: reception.utilisateur
            ? {
                id: reception.utilisateur.id,
                nom: reception.utilisateur.nom,
                prenom: reception.utilisateur.prenom,
            }
            : undefined,
    };
}

export function serialiserReceptions(
    receptions: ReceptionFournisseurAvecRelations[]
): ReceptionFournisseurType[] {
    return receptions.map(serialiserReception);
}