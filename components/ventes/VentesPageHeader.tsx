"use client";

import { ShoppingCart } from "lucide-react";

interface VentesPageHeaderProps {
    onCreateClick: () => void;
}

export default function VentesPageHeader({
    onCreateClick,
}: VentesPageHeaderProps) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
            {/* ── Titre + sous-titre ── */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-foreground font-display">
                    Ventes
                </h2>
                <p className="text-sm text-muted-foreground">
                    Gérez vos ventes et créez de nouvelles transactions.
                </p>
            </div>

            {/* ── Bouton d'action ── */}
            <button
                type="button"
                onClick={onCreateClick}
                className="
            inline-flex items-center justify-center gap-2
            rounded-full bg-primary text-primary-foreground
            px-6 py-3
            text-sm font-medium
            transition-opacity hover:opacity-90
        "
            >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Nouvelle vente
            </button>
        </header>
    );
}