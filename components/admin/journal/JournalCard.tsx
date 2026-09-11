import type { Activite } from "@/types/journal";
import JournalActionBadge from "./JournalActionBadge";

interface JournalCardProps {
    activite: Activite;
}

/**
 * Formate une date ISO en date et heure lisibles en français.
 */
function formaterDate(iso: string): string {
    const date = new Date(iso);

    const dateFormatee = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const heureFormatee = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return `${dateFormatee} ${heureFormatee}`;
}

/**
 * Construit une référence courte pour l'entité concernée.
 * Retourne "—" si l'entité n'est pas renseignée.
 */
function referenceEntite(activite: Activite): string {
    if (
        activite.entiteConcerneeType !== null &&
        activite.entiteConcerneeId !== null
    ) {
        return `${activite.entiteConcerneeType} #${activite.entiteConcerneeId.slice(0, 8)}`;
    }

    return "—";
}

/**
 * Carte affichant une activité du journal pour l'affichage mobile.
 */
export default function JournalCard({ activite }: JournalCardProps) {
    const entite = referenceEntite(activite);

    return (
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
            {/* Ligne du haut : badge d'action et date */}
            <div className="flex items-center justify-between">
                <JournalActionBadge action={activite.action} />
                <span className="text-xs text-muted-foreground">
                    {formaterDate(activite.dateAction)}
                </span>
            </div>

            {/* Référence de l'entité concernée, si présente */}
            {entite !== "—" && (
                <p className="text-sm font-medium text-foreground">
                    {entite}
                </p>
            )}

            {/* Détails de l'activité, si présents */}
            {activite.details !== null && (
                <p className="text-sm text-muted-foreground">
                    {activite.details}
                </p>
            )}

            {/* Utilisateur ayant effectué l'action */}
            <p className="text-xs text-muted-foreground">
                Par {activite.utilisateur.nom}
            </p>
        </div>
    );
}