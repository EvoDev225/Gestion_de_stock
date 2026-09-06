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
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                    type="search"
                    value={recherche}
                    onChange={(event) => onRechercheChange(event.target.value)}
                    placeholder="Rechercher un fournisseur..."
                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center rounded-lg border border-border bg-card p-1">
                    <button
                        type="button"
                        onClick={() => onVueChange("table")}
                        aria-pressed={vue === "table"}
                        aria-label="Vue liste"
                        className={`rounded p-2 transition-colors ${
                            vue === "table"
                                ? "bg-primary text-primary-foreground"
                                : "bg-transparent text-muted-foreground hover:bg-muted"
                        }`}
                    >
                        <List className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onVueChange("grille")}
                        aria-pressed={vue === "grille"}
                        aria-label="Vue grille"
                        className={`rounded p-2 transition-colors ${
                            vue === "grille"
                                ? "bg-primary text-primary-foreground"
                                : "bg-transparent text-muted-foreground hover:bg-muted"
                        }`}
                    >
                        <Grid className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onNouveauFournisseur}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Nouveau fournisseur
                </button>
            </div>
        </div>
    );
}