import { prisma } from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { ColonneExcel, LigneExport } from '@/lib/utils/excel-builder';

export interface StructureExport {
    nomFichier: string;
    feuilles: {
        nom: string;
        colonnes: ColonneExcel[];
        lignes: LigneExport[];
    }[];
}

export interface FiltresExport {
    dateDebut?: Date;
    dateFin?: Date;
    inventaireId?: string;
}

/**
  1. Export Stock (Produits non archivés)
 */
export async function obtenirExportStock(): Promise<StructureExport> {
    const produits = await prisma.produit.findMany({
        where: { archive: false },
        include: { categorie: true },
        orderBy: { nom: 'asc' },
    });

    const lignes = produits.map((p) => ({
        nom: p.nom,
        sku: p.sku,
        categorie: p.categorie?.nom || 'Sans catégorie',
        prixAchat: p.prixAchat.toNumber(),
        prixVente: p.prixVente.toNumber(),
        quantiteStock: p.quantiteStock,
        seuilMinimum: p.seuilMinimum,
    }));

    return {
        nomFichier: `export_stock_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Stock',
                colonnes: [
                    { header: 'Nom du produit', key: 'nom' },
                    { header: 'SKU', key: 'sku' },
                    { header: 'Catégorie', key: 'categorie' },
                    { header: 'Prix d\'achat (€)', key: 'prixAchat' },
                    { header: 'Prix de vente (€)', key: 'prixVente' },
                    { header: 'Quantité en stock', key: 'quantiteStock' },
                    { header: 'Seuil minimum', key: 'seuilMinimum' },
                ],
                lignes,
            },
        ],
    };
}

/**
  2. Export Produits Détaillés (Produits, Variantes, Lots)
 */
export async function obtenirExportProduitsDetail(): Promise<StructureExport> {
    const [produits, variantes, lots] = await Promise.all([
        prisma.produit.findMany({
            include: { categorie: true },
            orderBy: { nom: 'asc' },
        }),
        prisma.variante.findMany({
            include: { produit: true },
            orderBy: { nomVariante: 'asc' },
        }),
        prisma.lot.findMany({
            include: { produit: true, variante: true },
            orderBy: { dateExpiration: 'asc' },
        }),
    ]);

    const lignesProduits = produits.map((p) => ({
        id: p.id,
        nom: p.nom,
        sku: p.sku,
        categorie: p.categorie?.nom || 'Sans catégorie',
        prixAchat: p.prixAchat.toNumber(),
        prixVente: p.prixVente.toNumber(),
        quantiteStock: p.quantiteStock,
        seuilMinimum: p.seuilMinimum,
        archive: p.archive ? 'Oui' : 'Non',
        dateCreation: p.dateCreation.toISOString().split('T')[0],
    }));

    const lignesVariantes = variantes.map((v) => ({
        nomVariante: v.nomVariante,
        skuVariante: v.skuVariante,
        produitNom: v.produit.nom,
    }));

    const lignesLots = lots.map((l) => ({
        numeroLot: l.numeroLot,
        dateExpiration: l.dateExpiration.toISOString().split('T')[0],
        quantite: l.quantite,
        dateReception: l.dateReception.toISOString().split('T')[0],
        associeA: l.produit?.nom || l.variante?.nomVariante || 'N/A',
    }));

    return {
        nomFichier: `export_produits_details_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Produits',
                colonnes: [
                    { header: 'ID', key: 'id' },
                    { header: 'Nom', key: 'nom' },
                    { header: 'SKU', key: 'sku' },
                    { header: 'Catégorie', key: 'categorie' },
                    { header: 'Prix Achat', key: 'prixAchat' },
                    { header: 'Prix Vente', key: 'prixVente' },
                    { header: 'Stock', key: 'quantiteStock' },
                    { header: 'Seuil Min.', key: 'seuilMinimum' },
                    { header: 'Archivé', key: 'archive' },
                    { header: 'Date Création', key: 'dateCreation' },
                ],
                lignes: lignesProduits,
            },
            {
                nom: 'Variantes',
                colonnes: [
                    { header: 'Nom Variante', key: 'nomVariante' },
                    { header: 'SKU Variante', key: 'skuVariante' },
                    { header: 'Produit Parent', key: 'produitNom' },
                ],
                lignes: lignesVariantes,
            },
            {
                nom: 'Lots',
                colonnes: [
                    { header: 'Numéro de Lot', key: 'numeroLot' },
                    { header: 'Date Expiration', key: 'dateExpiration' },
                    { header: 'Quantité', key: 'quantite' },
                    { header: 'Date Réception', key: 'dateReception' },
                    { header: 'Produit / Variante', key: 'associeA' },
                ],
                lignes: lignesLots,
            },
        ],
    };
}

/**
  3. Export Mouvements de stock (Filtrable par date)
 */
export async function obtenirExportMouvements(
    filtres: FiltresExport
): Promise<StructureExport> {
    const whereDate: Prisma.DateTimeFilter = {};
    if (filtres.dateDebut) whereDate.gte = filtres.dateDebut;
    if (filtres.dateFin) whereDate.lte = filtres.dateFin;

    const mouvements = await prisma.mouvementStock.findMany({
        where: Object.keys(whereDate).length > 0 ? { dateMouvement: whereDate } : {},
        include: {
            produit: true,
            variante: true,
            lot: true,
            utilisateur: true,
        },
        orderBy: { dateMouvement: 'desc' },
    });

    const lignes = mouvements.map((m) => ({
        date: m.dateMouvement.toISOString().replace('T', ' ').substring(0, 19),
        type: m.typeMouvement,
        quantite: m.quantite,
        produit: m.produit.nom,
        variante: m.variante?.nomVariante || '-',
        lot: m.lot?.numeroLot || '-',
        motif: m.motif || '-',
        utilisateur: m.utilisateur.nom,
    }));

    return {
        nomFichier: `export_mouvements_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Mouvements de stock',
                colonnes: [
                    { header: 'Date & Heure', key: 'date' },
                    { header: 'Type', key: 'type' },
                    { header: 'Quantité', key: 'quantite' },
                    { header: 'Produit', key: 'produit' },
                    { header: 'Variante', key: 'variante' },
                    { header: 'Lot', key: 'lot' },
                    { header: 'Motif', key: 'motif' },
                    { header: 'Opérateur', key: 'utilisateur' },
                ],
                lignes,
            },
        ],
    };
}

/**
  4. Export Ventes (Filtrable par date)
 */
export async function obtenirExportVentes(
    filtres: FiltresExport
): Promise<StructureExport> {
    const whereDate: Prisma.DateTimeFilter = {};
    if (filtres.dateDebut) whereDate.gte = filtres.dateDebut;
    if (filtres.dateFin) whereDate.lte = filtres.dateFin;

    const ventes = await prisma.vente.findMany({
        where: Object.keys(whereDate).length > 0 ? { dateVente: whereDate } : {},
        include: { client: true, utilisateur: true },
        orderBy: { dateVente: 'desc' },
    });

    const lignes = ventes.map((v) => ({
        id: v.id,
        date: v.dateVente.toISOString().replace('T', ' ').substring(0, 19),
        montantTotal: v.montantTotal.toNumber(),
        statut: v.statut,
        modePaiement: v.modePaiement,
        client: v.client?.nom || 'Client Anonyme',
        vendeur: v.utilisateur.nom,
    }));

    return {
        nomFichier: `export_ventes_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Ventes',
                colonnes: [
                    { header: 'ID Vente', key: 'id' },
                    { header: 'Date', key: 'date' },
                    { header: 'Montant Total (€)', key: 'montantTotal' },
                    { header: 'Statut', key: 'statut' },
                    { header: 'Mode de Paiement', key: 'modePaiement' },
                    { header: 'Client', key: 'client' },
                    { header: 'Vendeur', key: 'vendeur' },
                ],
                lignes,
            },
        ],
    };
}

/**
  5. Export Créances (Ventes à crédit uniquement)
 */
export async function obtenirExportCreances(
    filtres: FiltresExport
): Promise<StructureExport> {
    const whereClause: Prisma.VenteWhereInput = { modePaiement: 'CREDIT' };
    if (filtres.dateDebut || filtres.dateFin) {
        const whereDate: Prisma.DateTimeFilter = {};
        if (filtres.dateDebut) whereDate.gte = filtres.dateDebut;
        if (filtres.dateFin) whereDate.lte = filtres.dateFin;
        whereClause.dateVente = whereDate;
    }

    const creances = await prisma.vente.findMany({
        where: whereClause,
        include: { client: true, utilisateur: true },
        orderBy: { dateVente: 'desc' },
    });

    const lignes = creances.map((c) => ({
        id: c.id,
        date: c.dateVente.toISOString().replace('T', ' ').substring(0, 19),
        montantDu: c.montantTotal.toNumber(),
        statut: c.statut,
        client: c.client?.nom || 'Inconnu',
        clientTelephone: c.client?.telephone || '-',
        vendeur: c.utilisateur.nom,
    }));

    return {
        nomFichier: `export_creances_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Créances (ventes à crédit)',
                colonnes: [
                    { header: 'ID Vente', key: 'id' },
                    { header: 'Date Vente', key: 'date' },
                    { header: 'Montant Dû (€)', key: 'montantDu' },
                    { header: 'Statut Vente', key: 'statut' },
                    { header: 'Client', key: 'client' },
                    { header: 'Téléphone Client', key: 'clientTelephone' },
                    { header: 'Enregistré par', key: 'vendeur' },
                ],
                lignes,
            },
        ],
    };
}

/**
  6. Export Fournisseur (Commandes & Réceptions)
 */
export async function obtenirExportFournisseurs(): Promise<StructureExport> {
    const [commandes, receptions] = await Promise.all([
        prisma.commandeFournisseur.findMany({
            include: { fournisseur: true, utilisateur: true },
            orderBy: { dateCommande: 'desc' },
        }),
        prisma.receptionFournisseur.findMany({
            include: {
                utilisateur: true,
                lignesReception: true,
            },
            orderBy: { dateReception: 'desc' },
        }),
    ]);

    const lignesCommandes = commandes.map((c) => ({
        id: c.id,
        dateCommande: c.dateCommande.toISOString().split('T')[0],
        statut: c.statut,
        fournisseur: c.fournisseur.nom,
        utilisateur: c.utilisateur.nom,
    }));

    const lignesReceptions = receptions.map((r) => {
        const totalQuantiteRecue = r.lignesReception.reduce(
            (acc, l) => acc + l.quantiteRecue,
            0
        );
        return {
            id: r.id,
            dateReception: r.dateReception.toISOString().replace('T', ' ').substring(0, 19),
            commandeId: r.commandeFournisseurId,
            quantiteTotaleRecue: totalQuantiteRecue,
            receptionnePar: r.utilisateur.nom,
        };
    });

    return {
        nomFichier: `export_fournisseurs_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Commandes',
                colonnes: [
                    { header: 'ID Commande', key: 'id' },
                    { header: 'Date Commande', key: 'dateCommande' },
                    { header: 'Statut', key: 'statut' },
                    { header: 'Fournisseur', key: 'fournisseur' },
                    { header: 'Créée par', key: 'utilisateur' },
                ],
                lignes: lignesCommandes,
            },
            {
                nom: 'Réceptions',
                colonnes: [
                    { header: 'ID Réception', key: 'id' },
                    { header: 'Date Réception', key: 'dateReception' },
                    { header: 'ID Commande', key: 'commandeId' },
                    { header: 'Quantité Totale Reçue', key: 'quantiteTotaleRecue' },
                    { header: 'Réceptionnée par', key: 'receptionnePar' },
                ],
                lignes: lignesReceptions,
            },
        ],
    };
}

/**
  7. Export Inventaires (Écarts d'inventaire)
 */
export async function obtenirExportInventaires(
    filtres: FiltresExport
): Promise<StructureExport> {
    const whereClause: Prisma.LigneInventaireWhereInput = {};
    if (filtres.inventaireId) {
        whereClause.inventaireId = filtres.inventaireId;
    }

    const lignesInventaire = await prisma.ligneInventaire.findMany({
        where: whereClause,
        include: {
            inventaire: true,
            produit: true,
            variante: true,
        },
        orderBy: { inventaire: { dateLancement: 'desc' } },
    });

    const lignes = lignesInventaire.map((l) => ({
        inventaireId: l.inventaireId,
        dateLancement: l.inventaire.dateLancement.toISOString().split('T')[0],
        statutInventaire: l.inventaire.statut,
        produit: l.produit.nom,
        variante: l.variante?.nomVariante || '-',
        quantiteTheorique: l.quantiteTheorique,
        quantitePhysique: l.quantitePhysique,
        ecart: l.ecart,
        justification: l.justification || '-',
    }));

    return {
        nomFichier: `export_inventaires_${Date.now()}.xlsx`,
        feuilles: [
            {
                nom: 'Écarts d\'inventaire',
                colonnes: [
                    { header: 'ID Inventaire', key: 'inventaireId' },
                    { header: 'Date Lancement', key: 'dateLancement' },
                    { header: 'Statut', key: 'statutInventaire' },
                    { header: 'Produit', key: 'produit' },
                    { header: 'Variante', key: 'variante' },
                    { header: 'Qté Théorique', key: 'quantiteTheorique' },
                    { header: 'Qté Physique', key: 'quantitePhysique' },
                    { header: 'Écart', key: 'ecart' },
                    { header: 'Justification', key: 'justification' },
                ],
                lignes,
            },
        ],
    };
}