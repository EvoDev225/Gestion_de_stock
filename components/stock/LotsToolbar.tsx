"use client";

import { Search } from "lucide-react";

interface LotsToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    expirationFilter: "tous" | "bientot" | "expires";
    onExpirationFilterChange: (filter: "tous" | "bientot" | "expires") => void;
}

export default function LotsToolbar({
    searchValue,
    onSearchChange,
    expirationFilter,
    onExpirationFilterChange,
}: LotsToolbarProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center">
            {/* ── Recherche ── */}
            <div className="relative flex-1 min-w-[240px]">
                <Search
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                />
                <input
                    type="text"
                    placeholder="Rechercher par numéro de lot, produit..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
            </div>

            {/* ── Filtre expiration ── */}
            <select
                value={expirationFilter}
                onChange={(e) =>
                    onExpirationFilterChange(e.target.value as "tous" | "bientot" | "expires")
                }
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Filtrer par date d'expiration"
            >
                <option value="tous">Toutes les dates</option>
                <option value="bientot">Expire bientôt (30 jours)</option>
                <option value="expires">Expirés</option>
            </select>
        </div>
    );
}