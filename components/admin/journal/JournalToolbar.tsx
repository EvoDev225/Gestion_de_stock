"use client";

type UtilisateurDisponible = {
    id: string;
    nom: string;
};

export interface JournalToolbarProps {
    actionsDisponibles: string[];
    utilisateursDisponibles: UtilisateurDisponible[];
    filtreAction: string;
    filtreUtilisateurId: string;
    filtreDateDebut: string;
    filtreDateFin: string;
    onFiltreActionChange: (valeur: string) => void;
    onFiltreUtilisateurIdChange: (valeur: string) => void;
    onFiltreDateDebutChange: (valeur: string) => void;
    onFiltreDateFinChange: (valeur: string) => void;
    onReinitialiser: () => void;
    nombreResultats: number;
}

const classesLibelle = "mb-1 text-xs font-medium text-muted-foreground";

const classesChampBase =
    "rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground";

const classesSelect = `${classesChampBase} min-w-[160px]`;

const classesBouton =
    "rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted";

/**
 * Barre de filtres du module Journal d'activité.
 * Affiche également le nombre de résultats et un bouton de réinitialisation.
 */
export default function JournalToolbar({
    actionsDisponibles,
    utilisateursDisponibles,
    filtreAction,
    filtreUtilisateurId,
    filtreDateDebut,
    filtreDateFin,
    onFiltreActionChange,
    onFiltreUtilisateurIdChange,
    onFiltreDateDebutChange,
    onFiltreDateFinChange,
    onReinitialiser,
    nombreResultats,
}: JournalToolbarProps) {
    // Le bouton de réinitialisation est affiché uniquement si au moins un filtre est actif.
    const auMoinsUnFiltreActif =
        filtreAction !== "" ||
        filtreUtilisateurId !== "" ||
        filtreDateDebut !== "" ||
        filtreDateFin !== "";

    return (
        <div className="space-y-3 rounded-lg border border-border bg-card p-3">
            <p className="text-sm text-muted-foreground">
                {nombreResultats} activité(s) trouvée(s)
            </p>

            <div className="flex flex-wrap items-end gap-3">
                {/* Filtre par action */}
                <div className="flex flex-col">
                    <label htmlFor="filtre-action" className={classesLibelle}>
                        Action
                    </label>
                    <select
                        id="filtre-action"
                        value={filtreAction}
                        onChange={(evenement) =>
                            onFiltreActionChange(evenement.target.value)
                        }
                        className={classesSelect}
                    >
                        <option value="">Toutes les actions</option>
                        {actionsDisponibles.map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtre par utilisateur */}
                <div className="flex flex-col">
                    <label
                        htmlFor="filtre-utilisateur"
                        className={classesLibelle}
                    >
                        Utilisateur
                    </label>
                    <select
                        id="filtre-utilisateur"
                        value={filtreUtilisateurId}
                        onChange={(evenement) =>
                            onFiltreUtilisateurIdChange(evenement.target.value)
                        }
                        className={classesSelect}
                    >
                        <option value="">Tous les utilisateurs</option>
                        {utilisateursDisponibles.map((utilisateur) => (
                            <option key={utilisateur.id} value={utilisateur.id}>
                                {utilisateur.nom}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtre par date de début */}
                <div className="flex flex-col">
                    <label htmlFor="filtre-date-debut" className={classesLibelle}>
                        Du
                    </label>
                    <input
                        id="filtre-date-debut"
                        type="date"
                        value={filtreDateDebut}
                        onChange={(evenement) =>
                            onFiltreDateDebutChange(evenement.target.value)
                        }
                        className={classesChampBase}
                    />
                </div>

                {/* Filtre par date de fin */}
                <div className="flex flex-col">
                    <label htmlFor="filtre-date-fin" className={classesLibelle}>
                        Au
                    </label>
                    <input
                        id="filtre-date-fin"
                        type="date"
                        value={filtreDateFin}
                        onChange={(evenement) =>
                            onFiltreDateFinChange(evenement.target.value)
                        }
                        className={classesChampBase}
                    />
                </div>

                {/* Bouton de réinitialisation, affiché uniquement si des filtres sont actifs */}
                {auMoinsUnFiltreActif && (
                    <button
                        type="button"
                        onClick={onReinitialiser}
                        className={classesBouton}
                    >
                        Réinitialiser
                    </button>
                )}
            </div>
        </div>
    );
}