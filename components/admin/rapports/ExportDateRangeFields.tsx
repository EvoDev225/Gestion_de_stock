"use client";

interface ExportDateRangeFieldsProps {
    dateDebut: string;
    dateFin: string;
    onDateDebutChange: (valeur: string) => void;
    onDateFinChange: (valeur: string) => void;
}

const classesLibelle = "mb-1 text-xs font-medium text-muted-foreground";

const classesChampDate =
    "rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground";

/**
 * Champs de sélection de période (Du / Au) pour filtrer un export.
 */
export default function ExportDateRangeFields({
    dateDebut,
    dateFin,
    onDateDebutChange,
    onDateFinChange,
}: ExportDateRangeFieldsProps) {
    return (
        <div className="flex flex-wrap items-end gap-3">
            {/* Champ de date de début */}
            <div className="flex flex-col">
                <label htmlFor="export-date-debut" className={classesLibelle}>
                    Du
                </label>
                <input
                    id="export-date-debut"
                    type="date"
                    value={dateDebut}
                    onChange={(evenement) =>
                        onDateDebutChange(evenement.target.value)
                    }
                    className={classesChampDate}
                />
            </div>

            {/* Champ de date de fin */}
            <div className="flex flex-col">
                <label htmlFor="export-date-fin" className={classesLibelle}>
                    Au
                </label>
                <input
                    id="export-date-fin"
                    type="date"
                    value={dateFin}
                    onChange={(evenement) =>
                        onDateFinChange(evenement.target.value)
                    }
                    className={classesChampDate}
                />
            </div>
        </div>
    );
}