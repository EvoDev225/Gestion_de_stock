"use client";

import type { InventaireOption } from "@/types/rapport";

interface InventaireSelectProps {
    inventaires: InventaireOption[];
    valeur: string;
    onChange: (id: string) => void;
}

const classesLibelle = "mb-1 text-xs font-medium text-muted-foreground";

const classesSelect =
    "rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground min-w-[220px]";

/**
 * Formate le libellé d'un inventaire pour l'affichage dans la liste déroulante.
 * Exemple : "10/09/2026 — VALIDE"
 */
function formaterLabelInventaire(inventaire: InventaireOption): string {
    const date = new Date(inventaire.dateLancement);
    const dateFormatee = date.toLocaleDateString("fr-FR");
    return `${dateFormatee} — ${inventaire.statut}`;
}

/**
 * Liste déroulante pour sélectionner un inventaire spécifique
 * dans le cadre d'un export filtré.
 */
export default function InventaireSelect({
    inventaires,
    valeur,
    onChange,
}: InventaireSelectProps) {
    return (
        <div className="flex flex-col">
            <label htmlFor="inventaire-select" className={classesLibelle}>
                Inventaire
            </label>
            <select
                id="inventaire-select"
                value={valeur}
                onChange={(e) => onChange(e.target.value)}
                className={classesSelect}
            >
                <option value="">Tous les inventaires</option>
                {inventaires.map((inventaire) => (
                    <option key={inventaire.id} value={inventaire.id}>
                        {formaterLabelInventaire(inventaire)}
                    </option>
                ))}
            </select>
        </div>
    );
}