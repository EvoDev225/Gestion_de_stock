import { prisma } from "@/lib/prisma";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerRetours(type?: "CLIENT" | "FOURNISSEUR") {
    return prisma.retour.findMany({
        where: type ? { typeRetour: type } : undefined,
        include: {
            lignesRetour: { include: { produit: true, variante: true, lot: true } },
            vente: true,
            commandeFournisseur: true,
            utilisateur: true,
        },
        orderBy: { dateRetour: "desc" },
    });
}

export async function obtenirRetourParId(id: string) {
    return prisma.retour.findUnique({
        where: { id },
        include: {
            lignesRetour: { include: { produit: true, variante: true, lot: true } },
            vente: true,
            commandeFournisseur: true,
            utilisateur: true,
        },
    });
}

type LigneRetourClientInput = { ligneVenteId: string; quantite: number };
type LigneRetourFournisseurInput = { lotId: string; quantite: number };

export async function creerRetour(data: {
    typeRetour: "CLIENT" | "FOURNISSEUR";
    venteId?: string;
    commandeFournisseurId?: string;
    motif?: string;
    utilisateurId: string;
    lignes: (LigneRetourClientInput | LigneRetourFournisseurInput)[];
}) {
    const cibleVente = Boolean(data.venteId);
    const cibleCommande = Boolean(data.commandeFournisseurId);

    if (cibleVente === cibleCommande) {
        throw new Error("Un retour doit référencer exactement une vente OU une commande fournisseur");
    }
    if (data.typeRetour === "CLIENT" && !data.venteId) {
        throw new Error("Un retour client doit référencer une vente");
    }
    if (data.typeRetour === "FOURNISSEUR" && !data.commandeFournisseurId) {
        throw new Error("Un retour fournisseur doit référencer une commande fournisseur");
    }
    if (data.lignes.length === 0) {
        throw new Error("Un retour doit contenir au moins une ligne");
    }

    return prisma.$transaction(async (tx) => {
        const lignesResolues: {
            produitId: string;
            varianteId: string | null;
            lotId: string;
            quantite: number;
        }[] = [];

        if (data.typeRetour === "CLIENT") {
            const vente = await tx.vente.findUnique({ where: { id: data.venteId } });
            if (!vente) {
                throw new Error(`Vente introuvable : ${data.venteId}`);
            }
            if (vente.statut !== "VALIDEE") {
                throw new Error("Impossible de retourner un article d'une vente déjà annulée");
            }

            const lignesClient = data.lignes as LigneRetourClientInput[];

            for (const ligne of lignesClient) {
                if (!ligne.ligneVenteId) {
                    throw new Error("ligneVenteId est requis pour chaque ligne d'un retour client");
                }

                const ligneVente = await tx.ligneVente.findUnique({
                    where: { id: ligne.ligneVenteId },
                });

                if (!ligneVente) {
                    throw new Error(`Ligne de vente introuvable : ${ligne.ligneVenteId}`);
                }
                if (ligneVente.venteId !== data.venteId) {
                    throw new Error(
                        `La ligne de vente ${ligne.ligneVenteId} n'appartient pas à la vente ${data.venteId}`
                    );
                }
                if (!ligneVente.lotId) {
                    throw new Error(
                        "Cette ligne de vente n'a pas de lot associé (vente antérieure à la migration lot), impossible de traiter le retour automatiquement"
                    );
                }
                if (ligne.quantite <= 0) {
                    throw new Error("La quantité retournée doit être supérieure à 0");
                }
                if (ligne.quantite > ligneVente.quantite) {
                    throw new Error(
                        `Quantité retournée (${ligne.quantite}) supérieure à la quantité vendue sur cette ligne (${ligneVente.quantite})`
                    );
                }

                lignesResolues.push({
                    produitId: ligneVente.produitId,
                    varianteId: ligneVente.varianteId,
                    lotId: ligneVente.lotId,
                    quantite: ligne.quantite,
                });
            }
        } else {
            const lignesFournisseur = data.lignes as LigneRetourFournisseurInput[];

            for (const ligne of lignesFournisseur) {
                if (!ligne.lotId) {
                    throw new Error("lotId est requis pour chaque ligne d'un retour fournisseur");
                }
                if (ligne.quantite <= 0) {
                    throw new Error("La quantité retournée doit être supérieure à 0");
                }

                const lot = await tx.lot.findUnique({ where: { id: ligne.lotId } });
                if (!lot) {
                    throw new Error(`Lot introuvable : ${ligne.lotId}`);
                }
                if (!lot.produitId && !lot.varianteId) {
                    throw new Error(`Le lot ${lot.numeroLot} n'est rattaché à aucun produit ni variante`);
                }
                if (ligne.quantite > lot.quantite) {
                    throw new Error(
                        `Quantité retournée (${ligne.quantite}) supérieure à la quantité disponible sur le lot ${lot.numeroLot} (${lot.quantite})`
                    );
                }

                let produitId = lot.produitId;
                if (!produitId && lot.varianteId) {
                    const variante = await tx.variante.findUnique({ where: { id: lot.varianteId } });
                    if (!variante) {
                        throw new Error(`Variante introuvable pour le lot ${lot.numeroLot}`);
                    }
                    produitId = variante.produitId;
                }

                lignesResolues.push({
                    produitId: produitId as string,
                    varianteId: lot.varianteId,
                    lotId: lot.id,
                    quantite: ligne.quantite,
                });
            }
        }

        const retour = await tx.retour.create({
            data: {
                typeRetour: data.typeRetour,
                venteId: data.venteId,
                commandeFournisseurId: data.commandeFournisseurId,
                motif: data.motif,
                dateRetour: new Date(),
                utilisateurId: data.utilisateurId,
                lignesRetour: {
                    create: lignesResolues.map((ligne) => ({
                        produitId: ligne.produitId,
                        varianteId: ligne.varianteId,
                        lotId: ligne.lotId,
                        quantite: ligne.quantite,
                    })),
                },
            },
            include: { lignesRetour: true },
        });

        const typeMouvement = data.typeRetour === "CLIENT" ? "ENTREE" : "SORTIE";

        for (const ligne of lignesResolues) {
            await tx.mouvementStock.create({
                data: {
                    produitId: ligne.produitId,
                    varianteId: ligne.varianteId,
                    lotId: ligne.lotId,
                    typeMouvement,
                    quantite: ligne.quantite,
                    motif: `Retour ${data.typeRetour} ${retour.id}`,
                    dateMouvement: new Date(),
                    utilisateurId: data.utilisateurId,
                },
            });

            await tx.lot.update({
                where: { id: ligne.lotId },
                data:
                    data.typeRetour === "CLIENT"
                        ? { quantite: { increment: ligne.quantite } }
                        : { quantite: { decrement: ligne.quantite } },
            });
        }

        await enregistrerActivite({
            action: "RETOUR_CREE",
            entiteConcerneeType: "Retour",
            entiteConcerneeId: retour.id,
            details: `Retour de type ${retour.typeRetour}`,
            utilisateurId: data.utilisateurId,
        }, tx);

        return retour;
    });
}