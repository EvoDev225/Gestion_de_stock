import { prisma } from "@/lib/prisma";
// import { Prisma } from '../../generated/prisma/client';


const SEUIL_JOURS_PEREMPTION = 7;

// ==========================================
// INTERFACES DES TYPES DE RETOUR
// ==========================================

export interface ProduitAlerte {
    nom: string;
    info: string;
    statut: "seuil_bas" | "peremption";
}

export interface EvolutionVentesJour {
    date: string; // YYYY-MM-DD
    montantTotal: number;
    nombre: number;
}

export interface TopProduitVendu {
    produitId: string;
    nom: string;
    quantiteTotale: number;
    chiffreAffaires: number;
}

export interface TopClient {
    nom: string;
    nombreAchats: number;
    montantTotal: number;
}

export interface StatistiquesClients {
    nombreTotalClients: number;
    topClients: TopClient[];
}

export interface CreancesEnCours {
    montantTotal: number;
    nombreVentes: number;
}

export interface StatistiquesRetours {
    nombreTotal: number;
    retoursClient: number;
    retoursFournisseur: number;
    tauxRetourVentes: number;
}

export interface StatistiquesFournisseurs {
    totalCommandes: number;
    totalReceptions: number;
    commandesParStatut: Record<string, number>;
    delaiMoyenReceptionJours: number | null;
}

export interface DernierEcartInventaire {
    produitNom: string;
    varianteNom: string | null;
    ecart: number;
    dateInventaire: Date;
    justification: string | null;
}

// ==========================================
// FONCTIONS EXISTANTES (MODIFIÉES / CONSERVÉES)
// ==========================================

export async function obtenirValeurStock(): Promise<number> {
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

export async function obtenirRepartitionParCategorie(): Promise<{ nom: string; pourcentage: number }[]> {
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

export async function obtenirProduitsASurveiller(): Promise<ProduitAlerte[]> {
    // Bug corrigé : Utilisation de $queryRaw au lieu d'une comparaison directe de colonnes non supportée dans .findMany()
    const produitsSeuilBas = await prisma.$queryRaw<
        { id: string; nom: string; quantiteStock: number }[]
    >`SELECT id, nom, "quantiteStock" FROM "Produit" WHERE archive = false AND "quantiteStock" <= "seuilMinimum"`;

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

    const alertesSeuilBas: ProduitAlerte[] = produitsSeuilBas.map((p) => ({
        nom: p.nom,
        info: `${p.quantiteStock} unité(s)`,
        statut: "seuil_bas" as const,
    }));

    const alertesPeremption: ProduitAlerte[] = lotsProchesPeremption.map((lot) => {
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

export async function obtenirVentesDuJour(): Promise<{ montantTotal: number; nombre: number }> {
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

export async function obtenirCommandesEnAttente(): Promise<number> {
    return prisma.commandeFournisseur.count({
        where: { statut: { in: ["EN_ATTENTE", "ENVOYEE"] } },
    });
}

export async function obtenirActiviteRecente(): Promise<string> {
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

// ==========================================
// NOUVELLES FONCTIONS STATISTIQUES
// ==========================================

/**
 * 1. Évolution des ventes sur N jours (avec remplissage des jours à 0)
 */
export async function obtenirEvolutionVentes(nombreJours: number = 30): Promise<EvolutionVentesJour[]> {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - (nombreJours - 1));
    dateDebut.setHours(0, 0, 0, 0);

    const ventes = await prisma.vente.findMany({
        where: {
            dateVente: { gte: dateDebut },
            statut: "VALIDEE",
        },
        select: {
            dateVente: true,
            montantTotal: true,
        },
    });

    // Agrégation par date au format YYYY-MM-DD
    const ventesParJour = new Map<string, { montantTotal: number; nombre: number }>();

    for (const v of ventes) {
        const dateCle = v.dateVente.toISOString().split("T")[0];
        const existant = ventesParJour.get(dateCle) ?? { montantTotal: 0, nombre: 0 };
        ventesParJour.set(dateCle, {
            montantTotal: existant.montantTotal + Number(v.montantTotal),
            nombre: existant.nombre + 1,
        });
    }

    // Génération du tableau complet chronologique (remplissage des trous à 0)
    const resultat: EvolutionVentesJour[] = [];
    const dateCourante = new Date(dateDebut);

    for (let i = 0; i < nombreJours; i++) {
        const dateCle = dateCourante.toISOString().split("T")[0];
        const donneeJour = ventesParJour.get(dateCle) ?? { montantTotal: 0, nombre: 0 };

        resultat.push({
            date: dateCle,
            montantTotal: donneeJour.montantTotal,
            nombre: donneeJour.nombre,
        });

        dateCourante.setDate(dateCourante.getDate() + 1);
    }

    return resultat;
}

/**
 * 2. Top des produits les plus vendus
 */
export async function obtenirTopProduitsVendus(limite: number = 10): Promise<TopProduitVendu[]> {
    const resultats = await prisma.$queryRaw<
        { produitId: string; nom: string; quantiteTotale: bigint; chiffreAffaires: number }[]
    >`
        SELECT 
            p.id AS "produitId",
            p.nom AS "nom",
            SUM(lv.quantite) AS "quantiteTotale",
            SUM(lv.quantite * lv."prixUnitaire") AS "chiffreAffaires"
        FROM "LigneVente" lv
        JOIN "Vente" v ON lv."venteId" = v.id
        JOIN "Produit" p ON lv."produitId" = p.id
        WHERE v.statut = 'VALIDEE'
        GROUP BY p.id, p.nom
        ORDER BY "quantiteTotale" DESC
        LIMIT ${limite}
    `;

    return resultats.map((r) => ({
        produitId: r.produitId,
        nom: r.nom,
        quantiteTotale: Number(r.quantiteTotale),
        chiffreAffaires: Number(r.chiffreAffaires),
    }));
}

/**
 * 3. Statistiques clients et top 5 des acheteurs
 */
export async function obtenirStatistiquesClients(): Promise<StatistiquesClients> {
    const nombreTotalClients = await prisma.client.count();

    const topClientsBrut = await prisma.$queryRaw<
        { nom: string; nombreAchats: bigint; montantTotal: number }[]
    >`
        SELECT 
            c.nom AS "nom",
            COUNT(v.id) AS "nombreAchats",
            SUM(v."montantTotal") AS "montantTotal"
        FROM "Client" c
        JOIN "Vente" v ON v."clientId" = c.id
        WHERE v.statut = 'VALIDEE'
        GROUP BY c.id, c.nom
        ORDER BY "montantTotal" DESC
        LIMIT 5
    `;

    const topClients: TopClient[] = topClientsBrut.map((c) => ({
        nom: c.nom,
        nombreAchats: Number(c.nombreAchats),
        montantTotal: Number(c.montantTotal),
    }));

    return {
        nombreTotalClients,
        topClients,
    };
}

/**
 * 4. Créances en cours (Ventes validées à crédit)
 */
export async function obtenirCreancesEnCours(): Promise<CreancesEnCours> {
    const ventesCredit = await prisma.vente.findMany({
        where: {
            modePaiement: "CREDIT",
            statut: "VALIDEE",
        },
        select: {
            montantTotal: true,
        },
    });

    const montantTotal = ventesCredit.reduce(
        (acc, v) => acc + Number(v.montantTotal),
        0
    );

    return {
        montantTotal,
        nombreVentes: ventesCredit.length,
    };
}

/**
 * 5. Statistiques globales des retours
 */
export async function obtenirStatistiquesRetours(nombreJours: number = 30): Promise<StatistiquesRetours> {
    const dateDebut = new Date();
    dateDebut.setDate(dateDebut.getDate() - (nombreJours - 1));
    dateDebut.setHours(0, 0, 0, 0);

    const [retours, nombreVentes] = await Promise.all([
        prisma.retour.findMany({
            where: {
                dateRetour: { gte: dateDebut },
            },
            select: {
                typeRetour: true,
            },
        }),
        prisma.vente.count({
            where: {
                dateVente: { gte: dateDebut },
                statut: "VALIDEE",
            },
        }),
    ]);

    const retoursClient = retours.filter((r) => r.typeRetour === "CLIENT").length;
    const retoursFournisseur = retours.filter((r) => r.typeRetour === "FOURNISSEUR").length;
    const nombreTotal = retours.length;

    const tauxRetourVentes = nombreVentes > 0
        ? Math.round((retoursClient / nombreVentes) * 1000) / 10
        : 0;

    return {
        nombreTotal,
        retoursClient,
        retoursFournisseur,
        tauxRetourVentes,
    };
}

/**
 * 6. Statistiques fournisseurs et délai moyen de réception
 */
export async function obtenirStatistiquesFournisseurs(): Promise<StatistiquesFournisseurs> {
    const [commandesGroupes, totalReceptions] = await Promise.all([
        prisma.commandeFournisseur.groupBy({
            by: ["statut"],
            _count: { statut: true },
        }),
        prisma.receptionFournisseur.count(),
    ]);

    const commandesParStatut: Record<string, number> = {};
    let totalCommandes = 0;

    for (const c of commandesGroupes) {
        commandesParStatut[c.statut] = c._count.statut;
        totalCommandes += c._count.statut;
    }

    // Calcul du délai moyen entre commande et première réception
    const delaisBruts = await prisma.$queryRaw<{ delaiJours: number }[]>`
        SELECT 
            EXTRACT(EPOCH FROM (MIN(r."dateReception") - c."dateCommande")) / 86400 AS "delaiJours"
        FROM "CommandeFournisseur" c
        JOIN "ReceptionFournisseur" r ON r."commandeFournisseurId" = c.id
        GROUP BY c.id, c."dateCommande"
    `;

    let delaiMoyenReceptionJours: number | null = null;
    if (delaisBruts.length > 0) {
        const sommeDelais = delaisBruts.reduce((acc, d) => acc + Number(d.delaiJours), 0);
        delaiMoyenReceptionJours = Math.round((sommeDelais / delaisBruts.length) * 10) / 10;
    }

    return {
        totalCommandes,
        totalReceptions,
        commandesParStatut,
        delaiMoyenReceptionJours,
    };
}

/**
 * 7. Derniers écarts constatés lors des inventaires
 */
export async function obtenirDerniersEcartsInventaire(limite: number = 10): Promise<DernierEcartInventaire[]> {
    const lignes = await prisma.ligneInventaire.findMany({
        where: {
            ecart: { not: 0 },
        },
        take: limite,
        orderBy: {
            inventaire: {
                dateLancement: "desc",
            },
        },
        select: {
            ecart: true,
            justification: true,
            produit: { select: { nom: true } },
            variante: { select: { nomVariante: true } },
            inventaire: { select: { dateLancement: true } },
        },
    });

    return lignes.map((l) => ({
        produitNom: l.produit.nom,
        varianteNom: l.variante?.nomVariante ?? null,
        ecart: l.ecart,
        dateInventaire: l.inventaire.dateLancement,
        justification: l.justification,
    }));
}