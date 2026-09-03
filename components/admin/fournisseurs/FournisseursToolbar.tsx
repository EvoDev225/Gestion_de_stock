"use client";

import { Grid, List, Plus, Search } from "lucide-react";

export interface FournisseursToolbarProps {
    recherche: string;
    onRechercheChange: (valeur: string) => void;
    vue: "table" | "grille";
    onVueChange: (vue: "table" | "grille") => void;
    onNouveauFournisseur: () => void;
}

export default function FournisseursToolbar({
    recherche,
    onRechercheChange,
    vue,
    onVueChange,
    onNouveauFournisseur,
}: FournisseursToolbarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="search"
                    value={recherche}
                    onChange={(event) => onRechercheChange(event.target.value)}
                    placeholder="Rechercher un fournisseur..."
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center rounded-md border border-gray-300 bg-white p-1">
                    <button
                        type="button"
                        onClick={() => onVueChange("table")}
                        aria-pressed={vue === "table"}
                        aria-label="Vue liste"
                        className={`rounded p-2 transition-colors ${vue === "table"
                                ? "bg-primary text-white"
                                : "bg-transparent text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <List className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onVueChange("grille")}
                        aria-pressed={vue === "grille"}
                        aria-label="Vue grille"
                        className={`rounded p-2 transition-colors ${vue === "grille"
                                ? "bg-primary text-white"
                                : "bg-transparent text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        <Grid className="h-4 w-4" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onNouveauFournisseur}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" />
                    Nouveau fournisseur
                </button>
            </div>
        </div>
    );
}