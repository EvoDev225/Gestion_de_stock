import { prisma } from "@/lib/prisma";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerVentes() {
    return prisma.vente.findMany({
        include: {
            client: true,
            ligneVentes: { include: { produit: true, variante: true, lot: true } },
        },
        orderBy: { dateVente: "desc" },
    });
}

export async function obtenirVenteParId(id: string) {
    return prisma.vente.findUnique({
        where: { id },
        include: {
            client: true,
            ligneVentes: { include: { produit: true, variante: true, lot: true } },
        },
    });
}

export async function creerVente(data: {
    clientId?: string;
    client?: { nom: string; telephone: string };
    utilisateurId: string;
    lignes: {
        produitId: string;
        varianteId?: string;
        lotId: string;
        quantite: number;
        prixUnitaire: number;
        stockInsuffisantConfirme?: boolean;
    }[];
}) {
    if (data.lignes.length === 0) {
        throw new Error("Une vente doit contenir au moins une ligne");
    }
    if (data.clientId && data.client) {
        throw new Error("Impossible de fournir clientId et client en même temps");
    }

    const montantTotal = data.lignes.reduce(
        (total, ligne) => total + ligne.quantite * ligne.prixUnitaire,
        0
    );

    return prisma.$transaction(async (tx) => {
        // 1. Client à la volée si fourni — insert direct, sans recherche ni dédup
        let clientId = data.clientId;
        if (data.client) {
            const nouveauClient = await tx.client.create({
                data: { nom: data.client.nom, telephone: data.client.telephone },
            });
            clientId = nouveauClient.id;
        }

        // 2. Validation de chaque ligne AVANT toute écriture (fail-fast)
        for (const ligne of data.lignes) {
            const produit = await tx.produit.findUnique({
                where: { id: ligne.produitId },
                include: { variantes: true },
            });
            if (!produit) {
                throw new Error(`Produit introuvable : ${ligne.produitId}`);
            }
            if (produit.variantes.length > 0 && !ligne.varianteId) {
                throw new Error(
                    `Le produit "${produit.nom}" a des variantes : varianteId obligatoire`
                );
            }

            const lot = await tx.lot.findUnique({ where: { id: ligne.lotId } });
            if (!lot) {
                throw new Error(`Lot introuvable : ${ligne.lotId}`);
            }

            const lotCorrespond = ligne.varianteId
                ? lot.varianteId === ligne.varianteId
                : lot.produitId === ligne.produitId;
            if (!lotCorrespond) {
                throw new Error(
                    `Le lot ${lot.numeroLot} ne correspond pas au produit/variante de la ligne`
                );
            }

            if (lot.quantite < ligne.quantite && !ligne.stockInsuffisantConfirme) {
                throw new Error(
                    `Stock insuffisant sur le lot ${lot.numeroLot} (disponible: ${lot.quantite}, demandé: ${ligne.quantite}) — confirmation requise`
                );
            }
        }

        // 3. Création de la vente + ses lignes
        const vente = await tx.vente.create({
            data: {
                clientId,
                utilisateurId: data.utilisateurId,
                montantTotal,
                dateVente: new Date(),
                ligneVentes: {
                    create: data.lignes.map((ligne) => ({
                        produitId: ligne.produitId,
                        varianteId: ligne.varianteId,
                        lotId: ligne.lotId,
                        quantite: ligne.quantite,
                        prixUnitaire: ligne.prixUnitaire,
                        stockInsuffisantConfirme: ligne.stockInsuffisantConfirme ?? false,
                    })),
                },
            },
            include: { ligneVentes: true },
        });

        // 4. Décrément du LOT uniquement — jamais Produit.quantiteStock
        // (stock réel = Σ lots, calculé à la volée côté stock.service.ts)
        for (const ligne of data.lignes) {
            await tx.lot.update({
                where: { id: ligne.lotId },
                data: { quantite: { decrement: ligne.quantite } },
            });

            await tx.mouvementStock.create({
                data: {
                    produitId: ligne.produitId,
                    varianteId: ligne.varianteId,
                    lotId: ligne.lotId,
                    typeMouvement: "SORTIE",
                    quantite: ligne.quantite,
                    motif: `Vente ${vente.id}`,
                    dateMouvement: new Date(),
                    utilisateurId: data.utilisateurId,
                },
            });
        }

        await enregistrerActivite({
            action: "VENTE_CREEE",
            entiteConcerneeType: "Vente",
            entiteConcerneeId: vente.id,
            details: `Vente de ${data.lignes.length} article(s), total ${montantTotal}`,
            utilisateurId: data.utilisateurId,
        }, tx);

        return vente;
    });
}

export async function annulerVente(id: string, utilisateurId: string) {
    // Décision actée : annulation = trace comptable seulement.
    // Le stock (Lot/MouvementStock) n'est jamais restitué ici — une vente
    // annulée ne représente pas nécessairement un retour physique de
    // marchandise. Un retour réel doit passer par le module Retour, qui
    // gère la restitution du stock correctement.
    return prisma.$transaction(async (tx) => {
        const vente = await tx.vente.update({
            where: { id },
            data: { statut: "ANNULEE" },
        });

        await enregistrerActivite({
            action: "VENTE_ANNULEE",
            entiteConcerneeType: "Vente",
            entiteConcerneeId: vente.id,
            details: `Annulation de la vente ${vente.id}`,
            utilisateurId,
        }, tx);

        return vente;
    });
}