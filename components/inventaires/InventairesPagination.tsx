"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface InventairesPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    itemLabel?: string;
}

export default function InventairesPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    itemLabel = "éléments",
}: InventairesPaginationProps) {
    // Calcul de la plage d'éléments affichés
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    // Génération des numéros de pages avec ellipses
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages + 2) {
            // Afficher toutes les pages si totalPages est petit
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Logique avec ellipses pour les grandes listes
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages === 0) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
            {/* Informations sur la pagination */}
            <div className="text-sm text-muted-foreground">
                Affichage de{" "}
                <span className="font-medium text-foreground">{startIndex}</span>
                {" "}à{" "}
                <span className="font-medium text-foreground">{endIndex}</span>
                {" "}sur{" "}
                <span className="font-medium text-foreground">{totalItems}</span>
                {" "}{itemLabel}
            </div>

            {/* Contrôles de navigation */}
            <div className="flex items-center gap-2">
                {/* Bouton première page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Première page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </button>

                {/* Bouton précédent */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Page précédente"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Numéros de pages */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="h-8 w-8 inline-flex items-center justify-center text-muted-foreground"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === currentPage;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                aria-current={isActive ? "page" : undefined}
                                aria-label={`Page ${pageNum}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Bouton suivant */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Page suivante"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* Bouton dernière page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Dernière page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}