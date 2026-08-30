import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';


export interface PeriodeRapport {
    dateDebut: Date;
    dateFin: Date;
}

export interface DonneesActivite {
    ventes: Prisma.VenteGetPayload<{
        include: { client: true; utilisateur: true };
    }>[];
    mouvementsStock: Prisma.MouvementStockGetPayload<{
        include: { produit: true; variante: true; lot: true };
    }>[];
    retours: Prisma.RetourGetPayload<{
        include: { lignesRetour: { include: { produit: true } } }; 
    }>[];
    commandesFournisseur: Prisma.CommandeFournisseurGetPayload<{
        include: { fournisseur: true };
    }>[];
    receptionsFournisseur: Prisma.ReceptionFournisseurGetPayload<{
        include: { commandeFournisseur: true };
    }>[];
    inventaires: Prisma.InventaireGetPayload<{
        include: {
            lignesInventaire: {
                include: { produit: true; variante: true };
            };
        };
    }>[];
}

/**
 * 1. Obtient le dernier rapport généré
 */
export async function obtenirDernierRapport() {
    return prisma.rapportActivite.findFirst({
        orderBy: { dateGeneration: 'desc' },
    });
}

/**
 * 2. Détermine la période couverte par le prochain rapport
 */
export async function determinerPeriode(): Promise<PeriodeRapport> {
    const dernierRapport = await obtenirDernierRapport();
    const dateFin = new Date();

    let dateDebut: Date;
    if (dernierRapport) {
        dateDebut = dernierRapport.dateGeneration;
    } else {
        dateDebut = new Date();
        dateDebut.setDate(dateDebut.getDate() - 30); // Repli de 30 jours pour le tout premier rapport
    }

    return { dateDebut, dateFin };
}

/**
 * 3. Collecte toutes les activités enregistrées pendant la période
 */
export async function collecterActivite(
    dateDebut: Date,
    dateFin: Date
): Promise<DonneesActivite> {
    const whereVente: Prisma.VenteWhereInput = {
        dateVente: { gte: dateDebut, lte: dateFin },
    };

    const whereMouvement: Prisma.MouvementStockWhereInput = {
        dateMouvement: { gte: dateDebut, lte: dateFin },
    };

    const whereRetour: Prisma.RetourWhereInput = {
        dateRetour: { gte: dateDebut, lte: dateFin },
    };

    const whereCommande: Prisma.CommandeFournisseurWhereInput = {
        dateCommande: { gte: dateDebut, lte: dateFin },
    };

    const whereReception: Prisma.ReceptionFournisseurWhereInput = {
        dateReception: { gte: dateDebut, lte: dateFin },
    };

    const whereInventaire: Prisma.InventaireWhereInput = {
        statut: 'VALIDE',
        dateLancement: { gte: dateDebut, lte: dateFin },
    };

    const [
        ventes,
        mouvementsStock,
        retours,
        commandesFournisseur,
        receptionsFournisseur,
        inventaires,
    ] = await Promise.all([
        prisma.vente.findMany({
            where: whereVente,
            include: { client: true, utilisateur: true },
            orderBy: { dateVente: 'asc' },
        }),
        prisma.mouvementStock.findMany({
            where: whereMouvement,
            include: { produit: true, variante: true, lot: true },
            orderBy: { dateMouvement: 'asc' },
        }),
        prisma.retour.findMany({
            where: whereRetour,
            include: {
                lignesRetour: {
                    include: { produit: true },
                },
            },
            orderBy: { dateRetour: 'asc' },
        }),
        prisma.commandeFournisseur.findMany({
            where: whereCommande,
            include: { fournisseur: true },
            orderBy: { dateCommande: 'asc' },
        }),
        prisma.receptionFournisseur.findMany({
            where: whereReception,
            include: { commandeFournisseur: true },
            orderBy: { dateReception: 'asc' },
        }),
        prisma.inventaire.findMany({
            where: whereInventaire,
            include: {
                lignesInventaire: {
                    where: { ecart: { not: 0 } },
                    include: { produit: true, variante: true },
                },
            },
            orderBy: { dateLancement: 'asc' },
        }),
    ]);

    return {
        ventes,
        mouvementsStock,
        retours,
        commandesFournisseur,
        receptionsFournisseur,
        inventaires,
    };
}

/**
 * 4. Formate les données collectées en un texte structuré pour le prompt IA
 */
export function formaterActivitePourPrompt(activite: DonneesActivite): string {
    const sections: string[] = [];

    // Ventes
    if (activite.ventes.length === 0) {
        sections.push('### VENTES\n- Aucune vente enregistrée sur cette période.');
    } else {
        const totalVentes = activite.ventes.reduce(
            (acc, v) => acc + v.montantTotal.toNumber(),
            0
        );
        const ventesCredit = activite.ventes.filter(
            (v) => v.modePaiement === 'CREDIT'
        );
        const totalCredit = ventesCredit.reduce(
            (acc, v) => acc + v.montantTotal.toNumber(),
            0
        );

        sections.push(
            `### VENTES\n` +
            `- Nombre total de ventes : ${activite.ventes.length}\n` +
            `- Chiffre d'affaires total : ${totalVentes.toFixed(2)} €\n` +
            `- Ventes à crédit : ${ventesCredit.length} pour un montant total de ${totalCredit.toFixed(2)} €`
        );
    }

    // Mouvements de stock
    if (activite.mouvementsStock.length === 0) {
        sections.push(
            '### MOUVEMENTS DE STOCK\n- Aucun mouvement de stock sur cette période.'
        );
    } else {
        const parType = activite.mouvementsStock.reduce((acc, m) => {
            acc[m.typeMouvement] = (acc[m.typeMouvement] || 0) + m.quantite;
            return acc;
        }, {} as Record<string, number>);

        const detailsTypes = Object.entries(parType)
            .map(([type, total]) => `  * ${type} : ${total} unité(s)`)
            .join('\n');

        sections.push(
            `### MOUVEMENTS DE STOCK\n` +
            `- Nombre total d'opérations : ${activite.mouvementsStock.length}\n` +
            `- Volume par type :\n${detailsTypes}`
        );
    }

    // Retours
    if (activite.retours.length === 0) {
        sections.push(
            '### RETOURS\n- Aucun retour client ou fournisseur enregistré sur cette période.'
        );
    } else {
        const retoursClient = activite.retours.filter(
            (r) => r.typeRetour === 'CLIENT'
        );
        const retoursFournisseur = activite.retours.filter(
            (r) => r.typeRetour === 'FOURNISSEUR'
        );

        sections.push(
            `### RETOURS\n` +
            `- Retours clients : ${retoursClient.length}\n` +
            `- Retours fournisseurs : ${retoursFournisseur.length}`
        );
    }

    // Commandes Fournisseurs
    if (
        activite.commandesFournisseur.length === 0 &&
        activite.receptionsFournisseur.length === 0
    ) {
        sections.push(
            '### FOURNISSEURS\n- Aucune commande ni réception enregistrée sur cette période.'
        );
    } else {
        sections.push(
            `### FOURNISSEURS\n` +
            `- Commandes passées : ${activite.commandesFournisseur.length}\n` +
            `- Réceptions effectuées : ${activite.receptionsFournisseur.length}`
        );
    }

    // Écarts d'inventaire
    const ecartsGlobal = activite.inventaires.flatMap(
        (i) => i.lignesInventaire
    );
    if (ecartsGlobal.length === 0) {
        sections.push(
            '### INVENTAIRES\n- Aucun écart d\'inventaire constaté sur les inventaires validés durant cette période.'
        );
    } else {
        const listeEcarts = ecartsGlobal
            .map(
                (e) =>
                    `  * ${e.produit.nom}${e.variante ? ` (${e.variante.nomVariante})` : ''} : Écart de ${e.ecart} unité(s) (Justification: ${e.justification || 'Aucune'})`
            )
            .join('\n');

        sections.push(
            `### INVENTAIRES ET ÉCARTS\n` +
            `- Nombre d'articles présentant un écart : ${ecartsGlobal.length}\n` +
            `- Détails des écarts :\n${listeEcarts}`
        );
    }

    return sections.join('\n\n');
}

/**
 * 5. Appelle l'API Gemini pour générer le résumé synthétique
 */
export async function genererResumeIA(texteActivite: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[Rapport IA] Erreur : Clé GEMINI_API_KEY non configurée.');
        throw new Error('La clé d\'API Gemini est absente du serveur.');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

        const prompt = `Tu es un assistant de gestion de stock et de commerce rédigé pour le gérant de l'établissement.
Analyse les données d'activité de la période ci-dessous et rédige un rapport d'activité synthétique, professionnel, concis et structuré en français.

Tes objectifs :
1. Résumer brièvement les performances de ventes et le volume d'affaires (en précisant les créances/ventes à crédit).
2. Pointer les mouvements de stock marquants (sorties, pertes, ajustements).
3. Signaler impérativement tout problème majeur : écarts d'inventaires non justifiés, taux de retour élevé, ou pertes anormales.
4. Résumer l'activité liée aux fournisseurs (commandes et réceptions).
5. Proposer 1 à 3 recommandations concrètes et concises basées sur ces données.

Consignes de format :
- Utilise un ton professionnel, direct et bienveillant.
- Sois concis : pas de phrase d'introduction inutile, va droit au but.
- Structure le rapport avec des titres clairs en Markdown (ex: ## Synthèse des ventes, ## Mouvements & Stocks, ## Alertes & Inventaires, ## Recommandations).

DONNÉES D'ACTIVITÉ :
${texteActivite}`;

        const response = await model.generateContent(prompt);
        const texteGenere = response.response.text();

        if (!texteGenere) {
            throw new Error('Aucun texte retourné par Gemini.');
        }

        return texteGenere;
    } catch (erreur) {
        console.error('[Rapport IA] Échec de la génération par Gemini :', erreur);
        throw new Error('Échec de la génération du rapport par le service IA.');
    }
}

/**
 * 6. Orchestre l'ensemble du processus et enregistre le rapport en base
 */
export async function genererEtEnregistrerRapport(utilisateurId: string) {
    const { dateDebut, dateFin } = await determinerPeriode();
    const activite = await collecterActivite(dateDebut, dateFin);
    const texteActivite = formaterActivitePourPrompt(activite);
    const contenuIA = await genererResumeIA(texteActivite);

    const nouveauRapport = await prisma.rapportActivite.create({
        data: {
            dateDebut,
            dateFin,
            contenu: contenuIA,
            utilisateurId,
        },
        include: {
            utilisateur: {
                select: { id: true, nom: true, email: true },
            },
        },
    });

    return nouveauRapport;
}