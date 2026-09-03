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
async function verifierModifiable(tx: typeof prisma, commandeId: string) {
    const commande = await tx.commandeFournisseur.findUnique({
        where: { id: commandeId },
    });
    if (!commande) {
        throw new Error("Commande introuvable");
    }
    if (commande.statut !== "EN_ATTENTE") {
        throw new Error("Les lignes ne sont modifiables que tant que la commande est EN_ATTENTE");
    }
    return commande;
}

export async function ajouterLigneCommande(
    commandeId: string,
    data: { produitId: string; quantiteCommande: number; prixAchatUnitaire: number },
    utilisateurId: string
) {
    if (data.quantiteCommande <= 0) {
        throw new Error("La quantité commandée doit être supérieure à zéro");
    }
    if (data.prixAchatUnitaire <= 0) {
        throw new Error("Le prix d'achat unitaire doit être supérieur à zéro");
    }

    return prisma.$transaction(async (tx) => {
        await verifierModifiable(tx, commandeId);

        const ligne = await tx.ligneCommandeFournisseur.create({
            data: {
                commandeFournisseurId: commandeId,
                produitId: data.produitId,
                quantiteCommande: data.quantiteCommande,
                prixAchatUnitaire: data.prixAchatUnitaire,
            },
        });

        await enregistrerActivite({
            action: "COMMANDE_LIGNE_AJOUTEE",
            entiteConcerneeType: "CommandeFournisseur",
            entiteConcerneeId: commandeId,
            details: `Ligne ajoutée : produit ${data.produitId}, quantité ${data.quantiteCommande}`,
            utilisateurId,
        }, tx);

        return ligne;
    });
}

export async function modifierLigneCommande(
    ligneId: string,
    data: { quantiteCommande?: number; prixAchatUnitaire?: number },
    utilisateurId: string
) {
    if (data.quantiteCommande !== undefined && data.quantiteCommande <= 0) {
        throw new Error("La quantité commandée doit être supérieure à zéro");
    }
    if (data.prixAchatUnitaire !== undefined && data.prixAchatUnitaire <= 0) {
        throw new Error("Le prix d'achat unitaire doit être supérieur à zéro");
    }

    return prisma.$transaction(async (tx) => {
        const ligneAvant = await tx.ligneCommandeFournisseur.findUnique({
            where: { id: ligneId },
        });
        if (!ligneAvant) {
            throw new Error("Ligne introuvable");
        }

        await verifierModifiable(tx, ligneAvant.commandeFournisseurId);

        const ligne = await tx.ligneCommandeFournisseur.update({
            where: { id: ligneId },
            data,
        });

        await enregistrerActivite({
            action: "COMMANDE_LIGNE_MODIFIEE",
            entiteConcerneeType: "CommandeFournisseur",
            entiteConcerneeId: ligneAvant.commandeFournisseurId,
            details: `Ligne modifiée : ${ligneId}`,
            utilisateurId,
        }, tx);

        return ligne;
    });
}

export async function supprimerLigneCommande(ligneId: string, utilisateurId: string) {
    return prisma.$transaction(async (tx) => {
        const ligne = await tx.ligneCommandeFournisseur.findUnique({
            where: { id: ligneId },
        });
        if (!ligne) {
            throw new Error("Ligne introuvable");
        }

        await verifierModifiable(tx, ligne.commandeFournisseurId);

        const nombreLignes = await tx.ligneCommandeFournisseur.count({
            where: { commandeFournisseurId: ligne.commandeFournisseurId },
        });
        if (nombreLignes <= 1) {
            throw new Error("Impossible de supprimer la dernière ligne : supprimez la commande entière à la place");
        }

        await tx.ligneCommandeFournisseur.delete({ where: { id: ligneId } });

        await enregistrerActivite({
            action: "COMMANDE_LIGNE_SUPPRIMEE",
            entiteConcerneeType: "CommandeFournisseur",
            entiteConcerneeId: ligne.commandeFournisseurId,
            details: `Ligne supprimée : ${ligneId}`,
            utilisateurId,
        }, tx);
    });
}

export async function supprimerCommandeFournisseur(id: string, utilisateurId: string) {
    return prisma.$transaction(async (tx) => {
        const commande = await tx.commandeFournisseur.findUnique({ where: { id } });
        if (!commande) {
            throw new Error("Commande introuvable");
        }
        if (commande.statut !== "EN_ATTENTE") {
            throw new Error("Seule une commande EN_ATTENTE peut être supprimée");
        }

        await tx.commandeFournisseur.delete({ where: { id } });

        await enregistrerActivite({
            action: "COMMANDE_SUPPRIMEE",
            entiteConcerneeType: "CommandeFournisseur",
            entiteConcerneeId: id,
            details: `Commande supprimée (fournisseur ${commande.fournisseurId})`,
            utilisateurId,
        }, tx);
    });
}