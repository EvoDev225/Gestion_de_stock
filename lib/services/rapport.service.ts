import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export interface PeriodeRapport {
    dateDebut: Date;
    dateFin: Date;
}

export interface DonneesActivite {
    ventes: Prisma.VenteGetPayload<{
        include: { client: true; utilisateur: true; ligneVentes: { include: { produit: true; variante: true } } };
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

// Utilitaire pour formater proprement en FCFA (ex: 1 500 000 FCFA)
function formatFCFA(montant: number): string {
    return `${Math.round(montant).toLocaleString('fr-FR')} FCFA`;
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
 * Liste les rapports générés, du plus récent au plus ancien.
 */
export async function listerRapports(limit: number = 20) {
    return prisma.rapportActivite.findMany({
        orderBy: { dateGeneration: 'desc' },
        take: limit,
        include: {
            utilisateur: {
                select: { id: true, nom: true, email: true },
            },
        },
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
        dateDebut.setHours(0, 0, 0, 0); // Début de journée
    }
    dateFin.setHours(23, 59, 59, 999); // Fin de journée

    return { dateDebut, dateFin };
}

/**
 * 3. Collecte toutes les activités enregistrées pendant la période
 */
export async function collecterActivite(
    dateDebut: Date,
    dateFin: Date
): Promise<DonneesActivite> {
    const [
        ventes,
        mouvementsStock,
        retours,
        commandesFournisseur,
        receptionsFournisseur,
        inventaires,
    ] = await Promise.all([
        prisma.vente.findMany({
            where: { dateVente: { gte: dateDebut, lte: dateFin } },
            include: { 
                client: true, 
                utilisateur: true,
                ligneVentes: { include: { produit: true, variante: true } } // Ajouté pour le Top Produits
            },
            orderBy: { dateVente: 'asc' },
        }),
        prisma.mouvementStock.findMany({
            where: { dateMouvement: { gte: dateDebut, lte: dateFin } },
            include: { produit: true, variante: true, lot: true },
            orderBy: { dateMouvement: 'asc' },
        }),
        prisma.retour.findMany({
            where: { dateRetour: { gte: dateDebut, lte: dateFin } },
            include: { lignesRetour: { include: { produit: true } } },
            orderBy: { dateRetour: 'asc' },
        }),
        prisma.commandeFournisseur.findMany({
            where: { dateCommande: { gte: dateDebut, lte: dateFin } },
            include: { fournisseur: true },
            orderBy: { dateCommande: 'asc' },
        }),
        prisma.receptionFournisseur.findMany({
            where: { dateReception: { gte: dateDebut, lte: dateFin } },
            include: { commandeFournisseur: true },
            orderBy: { dateReception: 'asc' },
        }),
        prisma.inventaire.findMany({
            where: { statut: 'VALIDE', dateLancement: { gte: dateDebut, lte: dateFin } },
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

    // --- VENTES ---
    if (activite.ventes.length === 0) {
        sections.push('### VENTES\n- Aucune vente enregistrée sur cette période.');
    } else {
        const totalVentes = activite.ventes.reduce((acc, v) => acc + v.montantTotal.toNumber(), 0);
        const ventesCredit = activite.ventes.filter((v) => v.modePaiement === 'CREDIT');
        const totalCredit = ventesCredit.reduce((acc, v) => acc + v.montantTotal.toNumber(), 0);

        // Calcul du Top 3 des produits vendus
        const produitsVendus = new Map<string, number>();
        activite.ventes.forEach((v) => {
            v.ligneVentes.forEach((l) => {
                const nom = `${l.produit.nom}${l.variante ? ` (${l.variante.nomVariante})` : ''}`;
                produitsVendus.set(nom, (produitsVendus.get(nom) || 0) + l.quantite);
            });
        });
        const topProduits = Array.from(produitsVendus.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([nom, qte]) => `  * ${nom} : ${qte} unité(s)`)
            .join('\n');

        sections.push(
            `### VENTES\n` +
            `- Nombre total de ventes : ${activite.ventes.length}\n` +
            `- Chiffre d'affaires total : ${formatFCFA(totalVentes)}\n` +
            `- Ventes à crédit : ${ventesCredit.length} pour un montant total de ${formatFCFA(totalCredit)}\n` +
            `- Top 3 des produits les plus vendus :\n${topProduits}`
        );
    }

    // --- MOUVEMENTS DE STOCK ---
    if (activite.mouvementsStock.length === 0) {
        sections.push('### MOUVEMENTS DE STOCK\n- Aucun mouvement de stock sur cette période.');
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

    // --- RETOURS ---
    if (activite.retours.length === 0) {
        sections.push('### RETOURS\n- Aucun retour client ou fournisseur enregistré sur cette période.');
    } else {
        const retoursClient = activite.retours.filter((r) => r.typeRetour === 'CLIENT');
        const retoursFournisseur = activite.retours.filter((r) => r.typeRetour === 'FOURNISSEUR');

        sections.push(
            `### RETOURS\n` +
            `- Retours clients : ${retoursClient.length}\n` +
            `- Retours fournisseurs : ${retoursFournisseur.length}`
        );
    }

    // --- FOURNISSEURS ---
    if (activite.commandesFournisseur.length === 0 && activite.receptionsFournisseur.length === 0) {
        sections.push('### FOURNISSEURS\n- Aucune commande ni réception enregistrée sur cette période.');
    } else {
        sections.push(
            `### FOURNISSEURS\n` +
            `- Commandes passées : ${activite.commandesFournisseur.length}\n` +
            `- Réceptions effectuées : ${activite.receptionsFournisseur.length}`
        );
    }

    // --- INVENTAIRES ---
    const ecartsGlobal = activite.inventaires.flatMap((i) => i.lignesInventaire);
    if (ecartsGlobal.length === 0) {
        sections.push('### INVENTAIRES\n- Aucun écart d\'inventaire constaté sur les inventaires validés durant cette période.');
    } else {
        const listeEcarts = ecartsGlobal
            .map((e) => `  * ${e.produit.nom}${e.variante ? ` (${e.variante.nomVariante})` : ''} : Écart de ${e.ecart} unité(s) (Justification: ${e.justification || 'Aucune'})`)
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
        // Correction : gemini-3.6-flash n'existe pas. Utilisation de gemini-1.5-flash (rapide et fiable)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Tu es un assistant expert en gestion de stock et en analyse commerciale, rédigé pour le gérant de l'établissement.
Analyse les données d'activité de la période ci-dessous et rédige un rapport d'activité synthétique, professionnel, concis et structuré en français.

Tes objectifs :
1. Résumer les performances de ventes et le volume d'affaires (en précisant les créances/ventes à crédit). Mentionne le Top 3 des produits.
2. Pointer les mouvements de stock marquants (sorties, pertes, ajustements).
3. Signaler impérativement tout problème majeur : écarts d'inventaires non justifiés, taux de retour élevé, ou pertes anormales.
4. Résumer l'activité liée aux fournisseurs (commandes et réceptions).
5. Proposer 1 à 3 recommandations concrètes et actionnables basées sur ces données.

Consignes de format STRICTES :
- Utilise un ton professionnel, direct et bienveillant.
- Sois concis : pas de phrase d'introduction inutile ("Voici le rapport..."), va droit au but.
- Structure le rapport avec des titres clairs en Markdown (ex: ## Synthèse des ventes, ## Mouvements & Stocks, ## Alertes & Inventaires, ## Recommandations).
- **Tous les montants doivent être exprimés en FCFA** (ex: 1 500 000 FCFA, et non 1500000 €).

DONNÉES D'ACTIVITÉ :
${texteActivite}`;

        const response = await model.generateContent(prompt);
        const texteGenere = response.response.text();

        if (!texteGenere || texteGenere.trim().length < 50) {
            throw new Error('Le texte retourné par Gemini est vide ou trop court.');
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