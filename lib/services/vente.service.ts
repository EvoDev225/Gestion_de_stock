import { prisma } from "@/lib/prisma";

export async function listerVentes() {
    return prisma.vente.findMany({
        include: { client: true, lignesVente: { include: { produit: true } } },
        orderBy: { dateVente: "desc" },
    });
}

export async function obtenirVenteParId(id: string) {
    return prisma.vente.findUnique({
        where: { id },
        include: { client: true, ligneVentes: { include: { produit: true } } },
    });
}

export async function creerVente(data: {
    clientId?: string;
    utilisateurId: string;
    lignes: { produitId: string; quantite: number; prixUnitaire: number }[];
}) {
    if (data.lignes.length === 0) {
        throw new Error("Une vente doit contenir au moins une ligne");
    }

    const montantTotal = data.lignes.reduce(
        (total, ligne) => total + ligne.quantite * ligne.prixUnitaire,
        0
    );

    return prisma.$transaction(async (tx) => {
        const vente = await tx.vente.create({
            data: {
                clientId: data.clientId,
                utilisateurId: data.utilisateurId,
                montantTotal,
                dateVente: new Date(),   // <-- ligne à ajouter
                ligneVentes: {
                    create: data.lignes.map((ligne) => ({
                        produitId: ligne.produitId,
                        quantite: ligne.quantite,
                        prixUnitaire: ligne.prixUnitaire,
                    })),
                },
            },
            include: { ligneVentes: true },
        });

        for (const ligne of data.lignes) {
            const produit = await tx.produit.findUnique({ where: { id: ligne.produitId } });

            if (!produit || produit.quantiteStock < ligne.quantite) {
                throw new Error(`Stock insuffisant pour le produit ${ligne.produitId}`);
            }

            await tx.mouvementStock.create({
                data: {
                    produitId: ligne.produitId,
                    typeMouvement: "SORTIE",
                    quantite: ligne.quantite,
                    motif: `Vente ${vente.id}`,
                    dateMouvement: new Date(),
                    utilisateurId: data.utilisateurId,
                },
            });

            await tx.produit.update({
                where: { id: ligne.produitId },
                data: { quantiteStock: { decrement: ligne.quantite } },
            });
        }

        return vente;
    });
}

export async function annulerVente(id: string) {
    return prisma.vente.update({
        where: { id },
        data: { statut: "ANNULEE" },
    });
}