"use client";

import { Search, LayoutList, LayoutGrid } from "lucide-react";

interface ProductsToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    categories: { id: string; nom: string }[];
    selectedCategoryId: string | null;
    onCategoryChange: (id: string | null) => void;
    statusFilter: "tous" | "actifs" | "archives";
    onStatusChange: (status: "tous" | "actifs" | "archives") => void;
    view: "table" | "grille";
    onViewChange: (view: "table" | "grille") => void;
}

export default function ProductsToolbar({
    searchValue,
    onSearchChange,
    categories,
    selectedCategoryId,
    onCategoryChange,
    statusFilter,
    onStatusChange,
    view,
    onViewChange,
}: ProductsToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            {/* ── Groupe gauche : Recherche + Filtres ── */}
            <div className="flex flex-1 flex-wrap items-center gap-4">
                {/* Recherche */}
                <div className="relative min-w-60 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, SKU..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-4 pl-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Filtre Catégorie */}
                <select
                    value={selectedCategoryId ?? ""}
                    onChange={(e) => onCategoryChange(e.target.value || null)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Filtrer par catégorie"
                >
                    <option value="">Catégorie : Toutes</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nom}
                        </option>
                    ))}
                </select>

                {/* Filtre Statut */}
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as "tous" | "actifs" | "archives")}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Filtrer par statut"
                >
                    <option value="tous">Tous</option>
                    <option value="actifs">Actifs</option>
                    <option value="archives">Archivés</option>
                </select>
            </div>

            {/* ── Groupe droite : Toggle Vue ── */}
            <div className="flex items-center rounded-lg border border-border bg-muted p-1">
                <button
                    type="button"
                    onClick={() => onViewChange("table")}
                    className={`inline-flex items-center justify-center rounded-md p-2 transition-colors ${view === "table"
                            ? "bg-card shadow-sm text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                    aria-label="Vue tableau"
                    aria-pressed={view === "table"}
                >
                    <LayoutList className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={() => onViewChange("grille")}
                    className={`inline-flex items-center justify-center rounded-md p-2 transition-colors ${view === "grille"
                            ? "bg-card shadow-sm text-primary"
                            : "text-muted-foreground hover:text-primary"
                        }`}
                    aria-label="Vue grille"
                    aria-pressed={view === "grille"}
                >
                    <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}