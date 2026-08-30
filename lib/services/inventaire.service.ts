import { prisma } from "@/lib/prisma";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerInventaires() {
    return prisma.inventaire.findMany({
        include: { lignesInventaire: { include: { produit: true } } },
        orderBy: { dateLancement: "desc" },
    });
}

export async function obtenirInventaireParId(id: string) {
    return prisma.inventaire.findUnique({
        where: { id },
        include: { lignesInventaire: { include: { produit: true } } },
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

    const produits = await prisma.produit.findMany({
        where: { id: { in: data.produitIds } },
    });

    return prisma.$transaction(async (tx) => {
        const inventaire = await tx.inventaire.create({
            data: {
                utilisateurId: data.utilisateurId,
                dateLancement: new Date(),
                statut: "EN_COURS",
                lignesInventaire: {
                    create: produits.map((produit) => ({
                        produitId: produit.id,
                        quantiteTheorique: produit.quantiteStock,
                        quantitePhysique: 0,
                        ecart: 0,
                    })),
                },
            },
            include: { lignesInventaire: true },
        });

        await enregistrerActivite({
            action: "INVENTAIRE_LANCE",
            entiteConcerneeType: "Inventaire",
            entiteConcerneeId: inventaire.id,
            details: `Inventaire lancé sur ${produits.length} produit(s)`,
            utilisateurId: data.utilisateurId,
        }, tx);

        return inventaire;
    });
}

// Étape 2 : saisir les quantités physiques et valider (génère les ajustements)
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

            if (ecart !== 0) {
                const mouvement = await tx.mouvementStock.create({
                    data: {
                        produitId: ligne.produitId,
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

                await tx.produit.update({
                    where: { id: ligne.produitId },
                    data: { quantiteStock: saisie.quantitePhysique },
                });
            }
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