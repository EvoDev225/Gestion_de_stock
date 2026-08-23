import { prisma } from "@/lib/prisma";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerCommandesFournisseur() {
    return prisma.commandeFournisseur.findMany({
        include: {
            fournisseur: true,
            ligneCommandeFournisseur: { include: { produit: true } },
        },
        orderBy: { dateCommande: "desc" },
    });
}

export async function obtenirCommandeFournisseurParId(id: string) {
    return prisma.commandeFournisseur.findUnique({
        where: { id },
        include: {
            fournisseur: true,
            ligneCommandeFournisseur: { include: { produit: true } },
        },
    });
}

export async function creerCommandeFournisseur(data: {
    fournisseurId: string;
    utilisateurId: string;
    lignes: { produitId: string; quantiteCommande: number; prixAchatUnitaire: number }[];
}) {
    if (data.lignes.length === 0) {
        throw new Error("Une commande doit contenir au moins une ligne");
    }

    return prisma.$transaction(async (tx) => {
        const commande = await tx.commandeFournisseur.create({
            data: {
                fournisseurId: data.fournisseurId,
                utilisateurId: data.utilisateurId,
                dateCommande: new Date(),
                statut: "EN_ATTENTE",
                ligneCommandeFournisseur: {
                    create: data.lignes.map((ligne) => ({
                        produitId: ligne.produitId,
                        quantiteCommande: ligne.quantiteCommande,
                        prixAchatUnitaire: ligne.prixAchatUnitaire,
                    })),
                },
            },
            include: { ligneCommandeFournisseur: true },
        });

        await enregistrerActivite({
            action: "COMMANDE_CREEE",
            entiteConcerneeType: "CommandeFournisseur",
            entiteConcerneeId: commande.id,
            details: `Commande créée auprès du fournisseur ${data.fournisseurId}, ${data.lignes.length} ligne(s)`,
            utilisateurId: data.utilisateurId,
        }, tx);

        return commande;
    });
}

export async function changerStatutCommande(
    id: string,
    statut: "EN_ATTENTE" | "ENVOYEE",
    utilisateurId: string
) {
    return prisma.$transaction(async (tx) => {
        const commandeAvant = await tx.commandeFournisseur.findUniqueOrThrow({
            where: { id },
        });

        const commande = await tx.commandeFournisseur.update({
            where: { id },
            data: { statut },
        });

        await enregistrerActivite({
            action: "COMMANDE_STATUT_CHANGE",
            entiteConcerneeType: "CommandeFournisseur",
            entiteConcerneeId: commande.id,
            details: `Statut changé : ${commandeAvant.statut} → ${statut}`,
            utilisateurId,
        }, tx);

        return commande;
    });
}