import { NextRequest, NextResponse } from 'next/server';
import { exigerRole } from '@/lib/auth';
import {
    creerWorkbook,
    ajouterFeuille,
    envoyerWorkbookEnReponse,
} from '@/lib/utils/excel-builder';
import {
    obtenirExportStock,
    obtenirExportProduitsDetail,
    obtenirExportMouvements,
    obtenirExportVentes,
    obtenirExportCreances,
    obtenirExportFournisseurs,
    obtenirExportInventaires,
    StructureExport,
} from '@/lib/services/export.service';

const EXPORTS_ADMIN_EMPLOYEE = ['stock', 'produits-detail', 'mouvements'];
const EXPORTS_ADMIN_ONLY = ['ventes', 'creances', 'fournisseur', 'inventaires'];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    try {
        const { type } = await params;

        // 1. Contrôle d'accès & validation du type d'export
        if (EXPORTS_ADMIN_EMPLOYEE.includes(type)) {
            await exigerRole(['ADMIN', 'EMPLOYEE']);
        } else if (EXPORTS_ADMIN_ONLY.includes(type)) {
            await exigerRole(['ADMIN']);
        } else {
            return NextResponse.json(
                { message: `Type d'export inconnu : ${type}` },
                { status: 400 }
            );
        }

        // 2. Extraction des query parameters
        const searchParams = request.nextUrl.searchParams;
        const dateDebutParam = searchParams.get('dateDebut');
        const dateFinParam = searchParams.get('dateFin');
        const inventaireIdParam = searchParams.get('inventaireId');

        const filtres = {
            dateDebut: dateDebutParam ? new Date(dateDebutParam) : undefined,
            dateFin: dateFinParam ? new Date(dateFinParam) : undefined,
            inventaireId: inventaireIdParam || undefined,
        };

        // 3. Appel du service selon le type d'exportation
        let donneesExport: StructureExport;

        switch (type) {
            case 'stock':
                donneesExport = await obtenirExportStock();
                break;
            case 'produits-detail':
                donneesExport = await obtenirExportProduitsDetail();
                break;
            case 'mouvements':
                donneesExport = await obtenirExportMouvements(filtres);
                break;
            case 'ventes':
                donneesExport = await obtenirExportVentes(filtres);
                break;
            case 'creances':
                donneesExport = await obtenirExportCreances(filtres);
                break;
            case 'fournisseur':
                donneesExport = await obtenirExportFournisseurs();
                break;
            case 'inventaires':
                donneesExport = await obtenirExportInventaires(filtres);
                break;
            default:
                return NextResponse.json(
                    { message: 'Type d\'export non pris en charge.' },
                    { status: 400 }
                );
        }

        // 4. Construction du fichier Excel via le builder
        const workbook = creerWorkbook();
        for (const feuille of donneesExport.feuilles) {
            ajouterFeuille(workbook, feuille.nom, feuille.colonnes, feuille.lignes);
        }

        // 5. Retour de la réponse binaire au client
        return await envoyerWorkbookEnReponse(workbook, donneesExport.nomFichier);
    } catch (error: any) {
        // Si exigerRole lève une erreur HTTP ou Response, nous la laissons remonter ou nous la gérons
        if (error?.status === 401 || error?.status === 403) {
            return NextResponse.json(
                { message: error.message || 'Non autorisé' },
                { status: error.status }
            );
        }

        console.error('Erreur lors de la génération de l\'export Excel :', error);

        return NextResponse.json(
            { message: 'Une erreur interne est survenue lors de l\'exportation.' },
            { status: 500 }
        );
    }
}