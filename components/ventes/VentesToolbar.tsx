"use client";

import { Search } from "lucide-react";

interface VentesToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    statusFilter: "tous" | "validees" | "annulees";
    onStatusChange: (value: "tous" | "validees" | "annulees") => void;
    modePaiementFilter: "tous" | "TOTAL" | "CREDIT";
    onModePaiementChange: (value: "tous" | "TOTAL" | "CREDIT") => void;
}

export default function VentesToolbar({
    searchValue,
    onSearchChange,
    statusFilter,
    onStatusChange,
    modePaiementFilter,
    onModePaiementChange,
}: VentesToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            {/* ── Groupe gauche : Recherche + Filtres ── */}
            <div className="flex flex-1 flex-wrap items-center gap-4">
                {/* Recherche */}
                <div className="relative min-w-60 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Rechercher par client ou vendeur..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-4 pl-10 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Filtre Statut */}
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as "tous" | "validees" | "annulees")}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Filtrer par statut des ventes"
                >
                    <option value="tous">Statut : Tous</option>
                    <option value="validees">Validées</option>
                    <option value="annulees">Annulées</option>
                </select>

                {/* Filtre Mode de paiement */}
                <select
                    value={modePaiementFilter}
                    onChange={(e) => onModePaiementChange(e.target.value as "tous" | "TOTAL" | "CREDIT")}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="Filtrer par mode de paiement"
                >
                    <option value="tous">Paiement : Tous</option>
                    <option value="TOTAL">Total</option>
                    <option value="CREDIT">Crédit</option>
                </select>
            </div>
        </div>
    );
}