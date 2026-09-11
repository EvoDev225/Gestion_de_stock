import type { Retour } from "@/types/retour";
import RetourTypeBadge from "./RetourTypeBadge";

interface RetoursTableProps {
    retours: Retour[];
}

function formaterDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function referenceRetour(retour: Retour) {
    if (retour.typeRetour === "CLIENT" && retour.vente) {
        return `Vente #${retour.vente.id.slice(0, 8)}`;
    }
    if (retour.typeRetour === "FOURNISSEUR" && retour.commandeFournisseur) {
        return `Commande #${retour.commandeFournisseur.id.slice(0, 8)}`;
    }
    return "—";
}

export default function RetoursTable({ retours }: RetoursTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Référence</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Lignes</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Motif</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Opérateur</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {retours.map((retour) => {
                        const quantiteTotale = retour.lignesRetour.reduce((total, l) => total + l.quantite, 0);
                        return (
                            <tr key={retour.id} className="hover:bg-muted/50">
                                <td className="px-4 py-3">
                                    <RetourTypeBadge type={retour.typeRetour} />
                                </td>
                                <td className="px-4 py-3 text-sm text-foreground">{referenceRetour(retour)}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{formaterDate(retour.dateRetour)}</td>
                                <td className="px-4 py-3 text-sm text-foreground">
                                    {retour.lignesRetour.length} ligne(s) · {quantiteTotale} unité(s)
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{retour.motif ?? "—"}</td>
                                <td className="px-4 py-3 text-sm text-foreground">{retour.utilisateur.nom}</td>
                            </tr>
                        );
                    })}
                    {retours.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                Aucun retour trouvé pour ce filtre.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}