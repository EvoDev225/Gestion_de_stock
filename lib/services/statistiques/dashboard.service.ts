import { prisma } from "@/lib/prisma";

const SEUIL_JOURS_PEREMPTION = 7;

export async function obtenirValeurStock() {
    const produits = await prisma.produit.findMany({
        where: { archive: false },
        select: { quantiteStock: true, prixAchat: true },
    });

    const total = produits.reduce(
        (acc, p) => acc + p.quantiteStock * Number(p.prixAchat),
        0
    );

    return total;
}

export async function obtenirRepartitionParCategorie() {
    const produits = await prisma.produit.findMany({
        where: { archive: false },
        select: {
            quantiteStock: true,
            prixAchat: true,
            categorie: { select: { nom: true } },
        },
    });

    const valeursParCategorie = new Map<string, number>();

    for (const produit of produits) {
        const nomCategorie = produit.categorie?.nom ?? "Sans catégorie";
        const valeur = produit.quantiteStock * Number(produit.prixAchat);
        valeursParCategorie.set(
            nomCategorie,
            (valeursParCategorie.get(nomCategorie) ?? 0) + valeur
        );
    }

    const totalGeneral = Array.from(valeursParCategorie.values()).reduce(
        (a, b) => a + b,
        0
    );

    return Array.from(valeursParCategorie.entries())
        .map(([nom, valeur]) => ({
            nom,
            pourcentage: totalGeneral > 0 ? Math.round((valeur / totalGeneral) * 100) : 0,
        }))
        .sort((a, b) => b.pourcentage - a.pourcentage);
}

export async function obtenirProduitsASurveiller() {
    const produitsSeuilBas = await prisma.produit.findMany({
        where: {
            archive: false,
            quantiteStock: { lte: prisma.produit.fields.seuilMinimum },
        },
        select: { id: true, nom: true, quantiteStock: true },
    });

    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() + SEUIL_JOURS_PEREMPTION);

    const lotsProchesPeremption = await prisma.lot.findMany({
        where: {
            dateExpiration: { lte: dateLimite, gte: new Date() },
            quantite: { gt: 0 },
        },
        select: {
            numeroLot: true,
            dateExpiration: true,
            produit: { select: { nom: true } },
            variante: { select: { nomVariante: true } },
        },
    });

    const alertesSeuilBas = produitsSeuilBas.map((p) => ({
        nom: p.nom,
        info: `${p.quantiteStock} unité(s)`,
        statut: "seuil_bas" as const,
    }));

    const alertesPeremption = lotsProchesPeremption.map((lot) => {
        const jours = Math.ceil(
            (lot.dateExpiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return {
            nom: lot.produit?.nom ?? lot.variante?.nomVariante ?? "Produit",
            info: `expire dans ${jours}j`,
            statut: "peremption" as const,
        };
    });

    return [...alertesSeuilBas, ...alertesPeremption];
}

export async function obtenirVentesDuJour() {
    const debutJournee = new Date();
    debutJournee.setHours(0, 0, 0, 0);

    const ventes = await prisma.vente.findMany({
        where: {
            dateVente: { gte: debutJournee },
            statut: "VALIDEE",
        },
        select: { montantTotal: true },
    });

    const montantTotal = ventes.reduce((acc, v) => acc + Number(v.montantTotal), 0);

    return { montantTotal, nombre: ventes.length };
}

export async function obtenirCommandesEnAttente() {
    return prisma.commandeFournisseur.count({
        where: { statut: { in: ["EN_ATTENTE", "ENVOYEE"] } },
    });
}

export async function obtenirActiviteRecente() {
    const depuis24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const activites = await prisma.journalActivite.findMany({
        where: { dateAction: { gte: depuis24h } },
        select: { action: true },
    });

    const compteurs: Record<string, number> = {};
    for (const a of activites) {
        const categorie = a.action.split("_")[0]; // "VENTE", "RECEPTION", "INVENTAIRE", etc.
        compteurs[categorie] = (compteurs[categorie] ?? 0) + 1;
    }

    if (Object.keys(compteurs).length === 0) {
        return "Aucune activité enregistrée dans les dernières 24 heures.";
    }

    const libelles: Record<string, string> = {
        VENTE: "vente(s)",
        RECEPTION: "réception(s)",
        COMMANDE: "commande(s)",
        RETOUR: "retour(s)",
        INVENTAIRE: "opération(s) d'inventaire",
        UTILISATEUR: "modification(s) de compte",
    };

    const phrase = Object.entries(compteurs)
        .map(([cat, n]) => `${n} ${libelles[cat] ?? cat.toLowerCase()}`)
        .join(", ");

    return `${phrase} enregistrées dans les dernières 24 heures.`;
}