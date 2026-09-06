"use client";

import { Plus } from "lucide-react";

type StatutFiltre = "TOUS" | "EN_ATTENTE" | "ENVOYEE" | "RECUE_PARTIELLE" | "RECUE";

interface CommandesToolbarProps {
    filtreStatut: StatutFiltre;
    onFiltreStatutChange: (statut: StatutFiltre) => void;
    onNouvelleCommande: () => void;
}

const statutLabels: Record<StatutFiltre, string> = {
    TOUS: "Tous",
    EN_ATTENTE: "En attente",
    ENVOYEE: "Envoyée",
    RECUE_PARTIELLE: "Reçue partielle",
    RECUE: "Reçue",
};

export default function CommandesToolbar({
    filtreStatut,
    onFiltreStatutChange,
    onNouvelleCommande,
}: CommandesToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="filtre-statut" className="text-sm font-medium text-foreground whitespace-nowrap">
                    Statut :
                </label>
                <select
                    id="filtre-statut"
                    value={filtreStatut}
                    onChange={(e) => onFiltreStatutChange(e.target.value as StatutFiltre)}
                    className="block w-full sm:w-auto rounded-lg border border-border bg-card text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                >
                    {Object.entries(statutLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={onNouvelleCommande}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
            >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Nouvelle commande
            </button>
        </div>
    );
}