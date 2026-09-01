"use client";

import { Plus } from "lucide-react";

interface StockPageHeaderProps {
    onCreateLotClick: () => void;
}

export default function StockPageHeader({ onCreateLotClick }: StockPageHeaderProps) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
            {/* ── Titre + sous-titre ── */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-foreground">
                    Stock &amp; Lots
                </h2>
                <p className="text-sm text-muted-foreground">
                    Suivez vos lots de stock et l'historique des mouvements.
                </p>
            </div>

            {/* ── Bouton d'action ── */}
            <button
                type="button"
                onClick={onCreateLotClick}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
            >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Nouveau lot
            </button>
        </header>
    );
}