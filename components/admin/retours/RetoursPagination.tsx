"use client";

/**
 * Composant de pagination réutilisable pour les listes en mémoire.
 */

export interface RetoursPaginationProps {
    /** Page affichée, indexée à partir de 1 */
    pageActuelle: number;
    /** Nombre total de pages */
    nombrePages: number;
    /** Callback appelé lors du changement de page */
    onPageChange: (page: number) => void;
}

const classesBoutonBase =
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors";

const classesBoutonActif =
    "text-foreground hover:bg-muted";

const classesBoutonDesactive =
    "text-muted-foreground/40 cursor-not-allowed";

export default function RetoursPagination({
    pageActuelle,
    nombrePages,
    onPageChange,
}: RetoursPaginationProps) {
    // Pas de pagination si une seule page ou liste vide
    if (nombrePages <= 1) {
        return null;
    }

    const precedentDesactive = pageActuelle <= 1;
    const suivantDesactive = pageActuelle >= nombrePages;

    return (
        <nav
            className="flex items-center justify-between border-t border-border px-4 pt-4"
            aria-label="Pagination des retours"
        >
            <button
                type="button"
                onClick={() => onPageChange(pageActuelle - 1)}
                disabled={precedentDesactive}
                className={`${classesBoutonBase} ${
                    precedentDesactive
                        ? classesBoutonDesactive
                        : classesBoutonActif
                }`}
            >
                Précédent
            </button>

            <p className="flex-1 text-center text-sm text-muted-foreground">
                Page {pageActuelle} sur {nombrePages}
            </p>

            <button
                type="button"
                onClick={() => onPageChange(pageActuelle + 1)}
                disabled={suivantDesactive}
                className={`${classesBoutonBase} ${
                    suivantDesactive
                        ? classesBoutonDesactive
                        : classesBoutonActif
                }`}
            >
                Suivant
            </button>
        </nav>
    );
}