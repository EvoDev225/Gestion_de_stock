"use client";

import { Plus } from "lucide-react";

interface InventairesPageHeaderProps {
    onCreateClick: () => void;
}

export default function InventairesPageHeader({ onCreateClick }: InventairesPageHeaderProps) {
    return (
        <div className="bg-transparent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            {/* Section Titre et Sous-titre */}
            <div className="space-y-1">
                <h1 className="font-bold text-2xl text-foreground">
                    Inventaires
                </h1>
                <p className="text-sm text-muted-foreground">
                    Suivez et validez les sessions de comptage physique du stock.
                </p>
            </div>

            {/* Bouton d'action */}
            <button
                onClick={onCreateClick}
                className="bg-primary text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
            >
                <Plus className="h-4 w-4" />
                Nouvel inventaire
            </button>
        </div>
    );
}