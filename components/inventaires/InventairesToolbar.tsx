"use client";

// Définition du type pour éviter de répéter l'union dans les props
type StatusFilter = "tous" | "en_cours" | "valide";

interface InventairesToolbarProps {
    statusFilter: StatusFilter;
    onStatusChange: (status: StatusFilter) => void;
}

export default function InventairesToolbar({
    statusFilter,
    onStatusChange,
}: InventairesToolbarProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-wrap items-center justify-between gap-4">

            {/* Section filtre à gauche */}
            <div className="flex items-center gap-2">
                <label
                    htmlFor="inventaire-status"
                    className="text-sm font-medium text-foreground whitespace-nowrap"
                >
                    Statut
                </label>
                <select
                    id="inventaire-status"
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                    <option value="tous">Tous</option>
                    <option value="en_cours">En cours</option>
                    <option value="valide">Validés</option>
                </select>
            </div>

            {/* 
        Côté droit volontairement vide. 
        La classe justify-between du parent gère l'espacement, 
        et comme il n'y a ni recherche ni toggle de vue, aucun élément n'est nécessaire ici.
      */}
        </div>
    );
}