"use client";

import { AlertTriangle } from "lucide-react";

interface LowStockBannerProps {
    count: number;
    onFilterClick: () => void;
}

export default function LowStockBanner({
    count,
    onFilterClick,
}: LowStockBannerProps) {
    if (count === 0) return null;

    return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-center justify-between gap-4">
                {/* ── Gauche : icône + texte ── */}
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                    <span className="text-sm font-medium text-foreground">
                        {count} {count === 1 ? "produit" : "produits"} en stock bas
                    </span>
                </div>

                {/* ── Droite : lien "Filtrer" ── */}
                <button
                    type="button"
                    onClick={onFilterClick}
                    className="shrink-0 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                >
                    Filtrer
                </button>
            </div>
        </div>
    );
}