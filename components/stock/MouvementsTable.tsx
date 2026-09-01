"use client";

import { History } from "lucide-react";
import type { MouvementStock } from "@/types/mouvement";
import { TYPE_MOUVEMENT_CONFIG } from "@/types/mouvement";

interface MouvementsTableProps {
    mouvements: MouvementStock[];
}

function formatDateTime(dateString: string | Date): string {
    return new Date(dateString).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getQuantityDisplay(mouvement: MouvementStock) {
    const qty = mouvement.quantite;
    const type = mouvement.typeMouvement;

    if (type === "ENTREE") {
        return <span className="text-primary">+{qty}</span>;
    }
    if (type === "SORTIE" || type === "PERTE" || type === "DOMMAGE") {
        return <span className="text-destructive">-{qty}</span>;
    }
    return <span className="text-foreground">{qty}</span>; // AJUSTEMENT ou autre
}

export default function MouvementsTable({ mouvements }: MouvementsTableProps) {
    return (
        <div className="hidden lg:block rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Type</th>
                        <th className="py-3 px-6">Produit / Variante</th>
                        <th className="py-3 px-6">Quantité</th>
                        <th className="py-3 px-6">Lot</th>
                        <th className="py-3 px-6">Motif</th>
                        <th className="py-3 px-6">Utilisateur</th>
                    </tr>
                </thead>
                <tbody>
                    {mouvements.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-12 px-6 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <History className="h-10 w-10 opacity-50" aria-hidden="true" />
                                    <span className="text-sm font-medium">Aucun mouvement enregistré</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        mouvements.map((mouvement, index) => {
                            const config = TYPE_MOUVEMENT_CONFIG[mouvement.typeMouvement] || {
                                label: mouvement.typeMouvement,
                                badgeClass: "bg-muted text-muted-foreground",
                            };

                            return (
                                <tr
                                    key={mouvement.id ?? index}
                                    className="border-b border-border transition-colors"
                                >
                                    {/* Date */}
                                    <td className="py-3 px-6 text-sm text-muted-foreground whitespace-nowrap">
                                        {formatDateTime(mouvement.dateMouvement)}
                                    </td>

                                    {/* Type */}
                                    <td className="py-3 px-6">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.badgeClass}`}
                                        >
                                            {config.label}
                                        </span>
                                    </td>

                                    {/* Produit / Variante */}
                                    <td className="py-3 px-6 text-sm font-medium text-foreground">
                                        {mouvement.variante?.nomVariante ?? mouvement.produit?.nom ?? "—"}
                                    </td>

                                    {/* Quantité */}
                                    <td className="py-3 px-6 text-sm font-medium">
                                        {getQuantityDisplay(mouvement)}
                                    </td>

                                    {/* Lot */}
                                    <td className="py-3 px-6 font-mono text-xs text-muted-foreground">
                                        {mouvement.lot?.numeroLot ?? "—"}
                                    </td>

                                    {/* Motif */}
                                    <td
                                        className="py-3 px-6 text-sm text-muted-foreground max-w-[200px] truncate"
                                        title={mouvement.motif || undefined}
                                    >
                                        {mouvement.motif ?? "—"}
                                    </td>

                                    {/* Utilisateur */}
                                    <td className="py-3 px-6 text-sm text-muted-foreground">
                                        {mouvement.utilisateur?.nom ?? mouvement.utilisateur?.email ?? "—"}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}