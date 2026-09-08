import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerReceptions(commandeFournisseurId?: string) {
    return prisma.receptionFournisseur.findMany({
        where: commandeFournisseurId ? { commandeFournisseurId } : undefined,
        include: {
            lignesReception: {
                include: { ligneCommandeFournisseur: { include: { produit: true } } },
            },
            commandeFournisseur: { include: { fournisseur: true } },
            utilisateur: true,
        },
        orderBy: { dateReception: "desc" },
    });
}
export async function creerReception(data: {
    commandeFournisseurId: string;
    utilisateurId: string;
    lignes: { ligneCommandeFournisseurId: string; quantiteRecue: number }[];
}) {
    if (data.lignes.length === 0) {
        throw new Error("Une réception doit contenir au moins une ligne");
    }

    if (data.lignes.some((l) => l.quantiteRecue <= 0)) {
        throw new Error("La quantité reçue doit être positive");
    }

    return prisma.$transaction(async (tx) => {
        const commande = await tx.commandeFournisseur.findUnique({
            where: { id: data.commandeFournisseurId },
            include: { ligneCommandeFournisseur: { include: { lignesReception: true } } },
        });

        if (!commande) {
            throw new Error("Commande introuvable");
        }

        if (commande.statut === "RECUE" || commande.statut === "EN_ATTENTE") {
            throw new Error(`Réception impossible : statut de commande "${commande.statut}"`);
        }

        for (const ligne of data.lignes) {
            const ligneCommande = commande.ligneCommandeFournisseur.find(
                (lc) => lc.id === ligne.ligneCommandeFournisseurId
            );

            if (!ligneCommande) {
                throw new Error(
                    `La ligne ${ligne.ligneCommandeFournisseurId} n'appartient pas à cette commande`
                );
            }

            const dejaRecu = ligneCommande.lignesReception.reduce(
                (somme, r) => somme + r.quantiteRecue,
                0
            );
            const restant = ligneCommande.quantiteCommande - dejaRecu;

            if (ligne.quantiteRecue > restant) {
                throw new Error(
                    `Quantité reçue (${ligne.quantiteRecue}) supérieure à la quantité restante (${restant}) pour cette ligne`
                );
            }
        }

        const reception = await tx.receptionFournisseur.create({
            data: {
                commandeFournisseurId: data.commandeFournisseurId,
                utilisateurId: data.utilisateurId,
                dateReception: new Date(),
                lignesReception: {
                    create: data.lignes.map((ligne) => ({
                        ligneCommandeFournisseurId: ligne.ligneCommandeFournisseurId,
                        quantiteRecue: ligne.quantiteRecue,
                    })),
                },
            },
            include: {
                lignesReception: {
                    include: { ligneCommandeFournisseur: { include: { produit: true } } },
                },
            },
        });

        for (const ligne of data.lignes) {
            const ligneCommande = commande.ligneCommandeFournisseur.find(
                (lc) => lc.id === ligne.ligneCommandeFournisseurId
            )!;

            await tx.mouvementStock.create({
                data: {
                    produitId: ligneCommande.produitId,
                    typeMouvement: "ENTREE",
                    quantite: ligne.quantiteRecue,
                    motif: `Réception ${reception.id}`,
                    dateMouvement: new Date(),
                    utilisateurId: data.utilisateurId,
                },
            });

            await tx.produit.update({
                where: { id: ligneCommande.produitId },
                data: { quantiteStock: { increment: ligne.quantiteRecue } },
            });
        }

        await recalculerStatutCommande(tx, data.commandeFournisseurId);
        await enregistrerActivite({
            action: "RECEPTION_CREEE",
            entiteConcerneeType: "ReceptionFournisseur",
            entiteConcerneeId: reception.id,
            details: `Réception liée à la commande ${reception.commandeFournisseurId}, ${data.lignes.length} ligne(s)`,
            utilisateurId: data.utilisateurId,
        }, tx);

        return reception;
    });
}

async function recalculerStatutCommande(
    tx: Prisma.TransactionClient,
    commandeFournisseurId: string
) {
    const lignesCommande = await tx.ligneCommandeFournisseur.findMany({
        where: { commandeFournisseurId },
        include: { lignesReception: true },
    });

    let totalCommande = 0;
    let totalRecu = 0;

    for (const ligne of lignesCommande) {
        totalCommande += ligne.quantiteCommande;
        totalRecu += ligne.lignesReception.reduce(
            (somme: number, r: { quantiteRecue: number }) => somme + r.quantiteRecue,
            0
        );
    }

    const nouveauStatut = totalRecu >= totalCommande ? "RECUE" : "RECUE_PARTIELLE";

    await tx.commandeFournisseur.update({
        where: { id: commandeFournisseurId },
        data: { statut: nouveauStatut },
    });
}