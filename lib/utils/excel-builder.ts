import ExcelJS from 'exceljs';

export interface ColonneExcel {
    header: string;
    key: string;
    width?: number;
}

/**
    Crée et retourne un nouveau workbook ExcelJS.
 */
export function creerWorkbook(): ExcelJS.Workbook {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Système d\'Inventaire';
    workbook.created = new Date();
    return workbook;
}

export type ValeurCellule = string | number | Date | boolean | null | undefined;
export type LigneExport = Record<string, ValeurCellule>;
/**
    Ajoute une feuille au workbook avec formatage automatique et ajustement de la largeur des colonnes.
 */
export function ajouterFeuille(
    workbook: ExcelJS.Workbook,
    nomFeuille: string,
    colonnes: ColonneExcel[],
    lignes: LigneExport[]
): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet(nomFeuille);

    // Configuration des colonnes
    worksheet.columns = colonnes.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width || 15,
    }));

    // Insertion des données
    worksheet.addRows(lignes);

    // Style de l'en-tête (Ligne 1) : Fond gris clair, texte en gras, centré verticalement
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FF1F2937' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE5E7EB' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
    headerRow.height = 24;

    // Ajustement automatique de la largeur des colonnes en fonction du contenu
    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        if (column.header) {
            maxLength = column.header.toString().length;
        }
        if (column.eachCell) {
            column.eachCell({ includeEmpty: false }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                if (cellValue.length > maxLength) {
                    maxLength = cellValue.length;
                }
            });
        }
        column.width = Math.max(maxLength + 4, column.width || 12);
    });

    return worksheet;
}

/**
    Génère le buffer XLSX et renvoie une Response Next.js configurée pour le téléchargement direct.
 */
export async function envoyerWorkbookEnReponse(
    workbook: ExcelJS.Workbook,
    nomFichier: string
): Promise<Response> {
    const buffer = await workbook.xlsx.writeBuffer();

    const headers = new Headers();
    headers.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    headers.set(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(nomFichier)}"`
    );

    return new Response(buffer, {
        status: 200,
        headers,
    });
}