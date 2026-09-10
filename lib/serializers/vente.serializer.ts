import { Prisma } from "../../generated/prisma/client";
import type { Vente as VenteType } from "@/types/vente";

type VenteAvecRelations = Prisma.VenteGetPayload<{
    include: {
        client: true;
        utilisateur: true;
        ligneVentes: {
            include: { produit: true; variante: true; lot: true };
        };
    };
}>;

export function serialiserVente(vente: VenteAvecRelations): VenteType {
    return {
        id: vente.id,
        dateVente: vente.dateVente.toISOString(),
        montantTotal: vente.montantTotal.toString(),
        statut: vente.statut,
        modePaiement: vente.modePaiement,
        clientId: vente.clientId,
        utilisateurId: vente.utilisateurId,
        client: vente.client
            ? { id: vente.client.id, nom: vente.client.nom, telephone: vente.client.telephone }
            : undefined,
        utilisateur: vente.utilisateur
            ? { id: vente.utilisateur.id, nom: vente.utilisateur.nom }
            : undefined,
        ligneVentes: vente.ligneVentes.map((ligne) => ({
            id: ligne.id,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire.toString(),
            stockInsuffisantConfirme: ligne.stockInsuffisantConfirme,
            produitId: ligne.produitId,
            varianteId: ligne.varianteId,
            lotId: ligne.lotId,
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
                : undefined,
            lot: ligne.lot
                ? {
                    id: ligne.lot.id,
                    numeroLot: ligne.lot.numeroLot,
                    dateExpiration: ligne.lot.dateExpiration
                        ? ligne.lot.dateExpiration.toISOString()
                        : null,
                }
                : undefined,
        })),
    };
}

export function serialiserVentes(ventes: VenteAvecRelations[]): VenteType[] {
    return ventes.map(serialiserVente);
}