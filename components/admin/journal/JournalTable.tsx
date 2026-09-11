import type { Activite } from "@/types/journal";
import JournalActionBadge from "./JournalActionBadge";

interface JournalTableProps {
    activites: Activite[];
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
 * Tableau des activités du journal.
 */
export default function JournalTable({ activites }: JournalTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                    <tr>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                        >
                            Action
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                        >
                            Entité concernée
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                        >
                            Détails
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                        >
                            Date
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground"
                        >
                            Utilisateur
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {activites.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                            >
                                Aucune activité trouvée pour ce filtre.
                            </td>
                        </tr>
                    ) : (
                        activites.map((activite) => (
                            <tr key={activite.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3 text-sm">
                                    <JournalActionBadge action={activite.action} />
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    {referenceEntite(activite)}
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                                        {activite.details ?? "—"}
                                    </div>
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    {formaterDate(activite.dateAction)}
                                </td>

                                <td className="px-4 py-3 text-sm">
                                    {activite.utilisateur.nom}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}