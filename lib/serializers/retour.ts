import { Prisma } from "../../generated/prisma/client";
import type { Retour as RetourType } from "@/types/retour";

type RetourAvecRelations = Prisma.RetourGetPayload<{
    include: {
        lignesRetour: {
            include: { produit: true; variante: true; lot: true };
        };
        vente: true;
        commandeFournisseur: true;
        utilisateur: true;
    };
}>;

export function serialiserRetour(retour: RetourAvecRelations): RetourType {
    return {
        id: retour.id,
        typeRetour: retour.typeRetour,
        dateRetour: retour.dateRetour.toISOString(),
        motif: retour.motif,
        venteId: retour.venteId,
        commandeFournisseurId: retour.commandeFournisseurId,
        utilisateurId: retour.utilisateurId,
        lignesRetour: retour.lignesRetour.map((ligne) => ({
            id: ligne.id,
            quantite: ligne.quantite,
            produitId: ligne.produitId,
            varianteId: ligne.varianteId,
            lotId: ligne.lotId,
            ligneVenteId: ligne.ligneVenteId,
            produit: {
                id: ligne.produit.id,
                nom: ligne.produit.nom,
                sku: ligne.produit.sku,
            },
            variante: ligne.variante
                ? {
                    id: ligne.variante.id,
                    nomVariante: ligne.variante.nomVariante,
                    skuVariante: ligne.variante.skuVariante,
                }
                : null,
            lot: ligne.lot
                ? {
                    id: ligne.lot.id,
                    numeroLot: ligne.lot.numeroLot,
                }
                : null,
        })),
        vente: retour.vente
            ? {
                id: retour.vente.id,
                dateVente: retour.vente.dateVente.toISOString(),
                montantTotal: retour.vente.montantTotal.toString(),
                statut: retour.vente.statut,
                modePaiement: retour.vente.modePaiement,
            }
            : null,
        commandeFournisseur: retour.commandeFournisseur
            ? {
                id: retour.commandeFournisseur.id,
                dateCommande: retour.commandeFournisseur.dateCommande.toISOString(),
                statut: retour.commandeFournisseur.statut,
            }
            : null,
        // Uniquement 'nom' exposé : jamais motDePasse ni email au frontend
        utilisateur: {
            id: retour.utilisateur.id,
            nom: retour.utilisateur.nom,
        },
    };
}

export function serialiserRetours(retours: RetourAvecRelations[]): RetourType[] {
    return retours.map(serialiserRetour);
}