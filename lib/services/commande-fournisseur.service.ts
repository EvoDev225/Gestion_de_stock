import { prisma } from "@/lib/prisma";

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

    return prisma.commandeFournisseur.create({
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
}

export async function changerStatutCommande(
    id: string,
    statut: "EN_ATTENTE" | "ENVOYEE"
) {
    return prisma.commandeFournisseur.update({
        where: { id },
        data: { statut },
    });
}