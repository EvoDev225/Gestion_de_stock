import { prisma } from "@/lib/prisma";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerInventaires() {
    return prisma.inventaire.findMany({
        include: { lignesInventaire: { include: { produit: true, variante: true } } },
        orderBy: { dateLancement: "desc" },
    });
}

export async function obtenirInventaireParId(id: string) {
    return prisma.inventaire.findUnique({
        where: { id },
        include: { lignesInventaire: { include: { produit: true, variante: true } } },
    });
}

// Étape 1 : lancer l'inventaire, capturer le stock théorique actuel
export async function lancerInventaire(data: {
    utilisateurId: string;
    produitIds: string[];
}) {
    if (data.produitIds.length === 0) {
        throw new Error("Un inventaire doit porter sur au moins un produit");
    }

    const inventaireEnCours = await prisma.inventaire.findFirst({
        where: { statut: "EN_COURS" },
    });

    if (inventaireEnCours) {
        throw new Error(
            "Un inventaire est déjà en cours. Il doit être validé avant d'en lancer un nouveau."
        );
    }

    const produits = await prisma.produit.findMany({
        where: { id: { in: data.produitIds } },
        include: { variantes: { include: { lots: true } } },
    });

    // ... reste inchangé

    // Produit sans variante -> 1 ligne sur le produit.
    // Produit avec variantes -> 1 ligne par variante, théorique = somme des lots.
    const lignesACreer = produits.flatMap((produit) => {
        if (produit.variantes.length > 0) {
            return produit.variantes.map((variante) => ({
                produitId: produit.id,
                varianteId: variante.id,
                quantiteTheorique: variante.lots.reduce((total, lot) => total + lot.quantite, 0),
                quantitePhysique: 0,
                ecart: 0,
            }));
        }
        return [{
            produitId: produit.id,
            varianteId: null,
            quantiteTheorique: produit.quantiteStock,
            quantitePhysique: 0,
            ecart: 0,
        }];
    });

    return prisma.$transaction(async (tx) => {
        const inventaire = await tx.inventaire.create({
            data: {
                utilisateurId: data.utilisateurId,
                dateLancement: new Date(),
                statut: "EN_COURS",
                lignesInventaire: { create: lignesACreer },
            },
            include: { lignesInventaire: true },
        });

        await enregistrerActivite({
            action: "INVENTAIRE_LANCE",
            entiteConcerneeType: "Inventaire",
            entiteConcerneeId: inventaire.id,
            details: `Inventaire lancé sur ${lignesACreer.length} ligne(s) (${produits.length} produit(s))`,
            utilisateurId: data.utilisateurId,
        }, tx);

        return inventaire;
    });
}

// Étape 2 : saisir les quantités physiques, valider, générer les ajustements
export async function validerInventaire(
    id: string,
    saisies: { ligneInventaireId: string; quantitePhysique: number; justification?: string }[],
    utilisateurValidateurId: string
) {
    return prisma.$transaction(async (tx) => {
        const inventaireExistant = await tx.inventaire.findUniqueOrThrow({
            where: { id },
        });

        for (const saisie of saisies) {
            const ligne = await tx.ligneInventaire.findUnique({
                where: { id: saisie.ligneInventaireId },
            });

            if (!ligne) {
                throw new Error(`Ligne d'inventaire ${saisie.ligneInventaireId} introuvable`);
            }

            const ecart = saisie.quantitePhysique - ligne.quantiteTheorique;

            await tx.ligneInventaire.update({
                where: { id: saisie.ligneInventaireId },
                data: {
                    quantitePhysique: saisie.quantitePhysique,
                    ecart,
                    justification: saisie.justification,
                },
            });

            if (ecart === 0) continue;

            let lotAjustementId: string | undefined;

            if (ligne.varianteId) {
                // Stock de variante = somme des lots. On crée un lot d'ajustement
                // dédié (quantité potentiellement négative) plutôt que de modifier
                // un lot physique existant, pour garder cette propriété toujours vraie.
                

                const lotAjustement = await tx.lot.create({
                    data: {
                        numeroLot: `AJUST-${id.slice(0, 8)}-${ligne.varianteId.slice(0, 8)}`,
                        quantite: ecart,
                        dateReception: new Date(),
                        // dateExpiration: dateExpirationPlaceholder,
                        varianteId: ligne.varianteId,
                    },
                });
                lotAjustementId = lotAjustement.id;
            } else {
                // Produit sans variante : quantiteStock est un champ direct, on l'écrase.
                await tx.produit.update({
                    where: { id: ligne.produitId },
                    data: { quantiteStock: saisie.quantitePhysique },
                });
            }

            const mouvement = await tx.mouvementStock.create({
                data: {
                    produitId: ligne.produitId,
                    varianteId: ligne.varianteId,
                    lotId: lotAjustementId,
                    typeMouvement: "AJUSTEMENT",
                    quantite: Math.abs(ecart),
                    motif: saisie.justification ?? `Ajustement inventaire ${id}`,
                    dateMouvement: new Date(),
                    utilisateurId: inventaireExistant.utilisateurId,
                },
            });

            await tx.ligneInventaire.update({
                where: { id: saisie.ligneInventaireId },
                data: { mouvementStockId: mouvement.id },
            });
        }

        await enregistrerActivite({
            action: "INVENTAIRE_VALIDE",
            entiteConcerneeType: "Inventaire",
            entiteConcerneeId: id,
            details: `Inventaire validé, ${saisies.length} ligne(s) saisie(s)`,
            utilisateurId: utilisateurValidateurId,
        }, tx);

        return tx.inventaire.update({
            where: { id },
            data: {
                statut: "VALIDE",
                utilisateurValidateurId,
                dateValidation: new Date(),
            },
            include: { lignesInventaire: true },
        });
    });
}

export async function ajouterLigneInventaire(
    inventaireId: string,
    produitId: string,
    varianteId: string | null
) {
    const inventaire = await prisma.inventaire.findUniqueOrThrow({
        where: { id: inventaireId },
    });

    if (inventaire.statut !== "EN_COURS") {
        throw new Error("Impossible d'ajouter une ligne à un inventaire déjà validé");
    }

    let quantiteTheorique: number;

    if (varianteId) {
        const lots = await prisma.lot.findMany({ where: { varianteId } });
        quantiteTheorique = lots.reduce((total, lot) => total + lot.quantite, 0);
    } else {
        const produit = await prisma.produit.findUniqueOrThrow({ where: { id: produitId } });
        quantiteTheorique = produit.quantiteStock;
    }

    return prisma.ligneInventaire.create({
        data: {
            inventaireId,
            produitId,
            varianteId,
            quantiteTheorique,
            quantitePhysique: 0,
            ecart: 0,
        },
        include: { produit: true, variante: true },
    });
}