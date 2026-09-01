"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function ProductsPagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: ProductsPaginationProps) {
    if (totalPages <= 1) return null;

    // Calcul de la plage d'éléments affichés
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Logique de fenêtre glissante pour afficher max 5 pages
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
}

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-between items-center mt-4 px-2">
            {/* ── Gauche : Information sur la plage ── */}
            <span className="text-xs text-muted-foreground">
                Affichage {startItem}-{endItem} sur {totalItems} produits
            </span>

            {/* ── Droite : Contrôles de pagination ── */}
            <div className="flex gap-2">
                {/* Bouton Précédent */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    aria-label="Page précédente"
                >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                {/* Boutons numérotés */}
                {pages.map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-medium transition-colors ${page === currentPage
                                ? "bg-primary text-white border-primary"
                                : "border-border text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Bouton Suivant */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    aria-label="Page suivante"
                >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}