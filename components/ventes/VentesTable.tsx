"use client";

import { ShoppingBag, XCircle } from "lucide-react";
import type { Vente } from "@/types/vente";

interface VentesTableProps {
    ventes: Vente[];
    onRequestCancel: (vente: Vente) => void;
    onRowClick: (vente: Vente) => void;
}

export default function VentesTable({
    ventes,
    onRequestCancel,
    onRowClick,
}: VentesTableProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Client</th>
                        <th className="py-3 px-6">Vendeur</th>
                        <th className="py-3 px-6">Montant</th>
                        <th className="py-3 px-6">Statut</th>
                        <th className="py-3 px-6">Mode de paiement</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ventes.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-12 px-6 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <ShoppingBag className="h-10 w-10 opacity-50" aria-hidden="true" />
                                    <span className="text-sm font-medium">Aucune vente trouvée</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        ventes.map((vente) => (
                            <tr
                                key={vente.id}
                                onClick={() => onRowClick(vente)}
                                className="border-b border-border transition-colors hover:bg-muted/30 cursor-pointer"
                            >
                                {/* Date */}
                                <td className="py-3 px-6 text-sm text-foreground">
                                    {new Date(vente.dateVente).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </td>

                                {/* Client */}
                                <td className="py-3 px-6 text-sm">
                                    {vente.client?.nom ? (
                                        <span className="text-foreground">{vente.client.nom}</span>
                                    ) : (
                                        <span className="text-muted-foreground italic">Client anonyme</span>
                                    )}
                                </td>

                                {/* Vendeur */}
                                <td className="py-3 px-6 text-sm text-foreground">
                                    {vente.utilisateur?.nom ?? "—"}
                                </td>

                                {/* Montant */}
                                <td className="py-3 px-6 text-sm font-semibold text-primary">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'XOF',
                                    }).format(parseFloat(vente.montantTotal))}
                                </td>

                                {/* Statut */}
                                <td className="py-3 px-6">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            vente.statut === "VALIDEE"
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted/50 text-muted-foreground"
                                        }`}
                                    >
                                        {vente.statut === "VALIDEE" ? "Validée" : "Annulée"}
                                    </span>
                                </td>

                                {/* Mode de paiement */}
                                <td className="py-3 px-6">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            vente.modePaiement === "TOTAL"
                                                ? "bg-accent-subtle text-accent-hover"
                                                : "bg-warning/10 text-warning"
                                        }`}
                                    >
                                        {vente.modePaiement === "TOTAL" ? "Total" : "Crédit"}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-6">
                                    <div className="flex justify-end gap-2">
                                        {vente.statut === "VALIDEE" ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRequestCancel(vente);
                                                }}
                                                title="Annuler la vente"
                                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                                            >
                                                <XCircle className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}