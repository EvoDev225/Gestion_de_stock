import { prisma } from "@/lib/prisma";
import { enregistrerActivite } from "./journal-activite.service";

export async function listerRetours(type?: "CLIENT" | "FOURNISSEUR") {
    return prisma.retour.findMany({
        where: type ? { typeRetour: type } : undefined,
        include: { lignesRetour: { include: { produit: true } } },
        orderBy: { dateRetour: "desc" },
    });
}

export async function creerRetour(data: {
    typeRetour: "CLIENT" | "FOURNISSEUR";
    venteId?: string;
    commandeFournisseurId?: string;
    motif?: string;
    utilisateurId: string;
    lignes: { produitId: string; quantite: number; varianteId?: string }[];
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

    const typeMouvement = data.typeRetour === "CLIENT" ? "ENTREE" : "SORTIE";

    return prisma.$transaction(async (tx) => {
        const retour = await tx.retour.create({
            data: {
                typeRetour: data.typeRetour,
                venteId: data.venteId,
                commandeFournisseurId: data.commandeFournisseurId,
                motif: data.motif,
                dateRetour: new Date(),
                utilisateurId: data.utilisateurId,
                lignesRetour: {
                    create: data.lignes.map((ligne) => ({
                        produitId: ligne.produitId,
                        quantite: ligne.quantite,
                        varianteId: ligne.varianteId,
                    })),
                },
            },
            include: { lignesRetour: true },
        });

        for (const ligne of data.lignes) {
            await tx.mouvementStock.create({
                data: {
                    produitId: ligne.produitId,
                    varianteId: ligne.varianteId,
                    typeMouvement,
                    quantite: ligne.quantite,
                    motif: `Retour ${data.typeRetour} ${retour.id}`,
                    dateMouvement: new Date(),
                    utilisateurId: data.utilisateurId,
                },
            });

            const ajustement =
                data.typeRetour === "CLIENT"
                    ? { increment: ligne.quantite }
                    : { decrement: ligne.quantite };

            await tx.produit.update({
                where: { id: ligne.produitId },
                data: { quantiteStock: ajustement },
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