"use client";

import { ShoppingBag, XCircle } from "lucide-react";
import type { Vente } from "@/types/vente";

interface VentesTableProps {
    ventes: Vente[];
    onRequestCancel: (vente: Vente) => void;
    onRowClick: (vente: Vente) => void;
}

function formatMontant(montant: string | number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
    }).format(parseFloat(String(montant)));
}

function formatDate(dateVente: string | Date): string {
    return new Date(dateVente).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function VentesTable({ ventes, onRequestCancel, onRowClick }: VentesTableProps) {
    return (
        <>
            {/* ✅ TABLEAU — desktop uniquement */}
            <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
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
                                    <td className="py-3 px-6 text-sm text-foreground">{formatDate(vente.dateVente)}</td>
                                    <td className="py-3 px-6 text-sm">
                                        {vente.client?.nom ? (
                                            <span className="text-foreground">{vente.client.nom}</span>
                                        ) : (
                                            <span className="text-muted-foreground italic">Client anonyme</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-sm text-foreground">{vente.utilisateur?.nom ?? "—"}</td>
                                    <td className="py-3 px-6 text-sm font-semibold text-primary">{formatMontant(vente.montantTotal)}</td>
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

            {/* ✅ CARTES — mobile uniquement */}
            <div className="md:hidden flex flex-col gap-3">
                {ventes.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card py-12 px-6 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-3">
                            <ShoppingBag className="h-10 w-10 opacity-50" aria-hidden="true" />
                            <span className="text-sm font-medium">Aucune vente trouvée</span>
                        </div>
                    </div>
                ) : (
                    ventes.map((vente) => (
                        <div
                            key={vente.id}
                            onClick={() => onRowClick(vente)}
                            className="rounded-xl border border-border bg-card p-4 space-y-3 cursor-pointer active:bg-muted/30 transition-colors"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {vente.client?.nom || "Client anonyme"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(vente.dateVente)} · {vente.utilisateur?.nom ?? "—"}
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-primary shrink-0">
                                    {formatMontant(vente.montantTotal)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            vente.statut === "VALIDEE"
                                                ? "bg-primary/10 text-primary"
                                                : "bg-muted/50 text-muted-foreground"
                                        }`}
                                    >
                                        {vente.statut === "VALIDEE" ? "Validée" : "Annulée"}
                                    </span>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                            vente.modePaiement === "TOTAL"
                                                ? "bg-accent-subtle text-accent-hover"
                                                : "bg-warning/10 text-warning"
                                        }`}
                                    >
                                        {vente.modePaiement === "TOTAL" ? "Total" : "Crédit"}
                                    </span>
                                </div>

                                {vente.statut === "VALIDEE" && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRequestCancel(vente);
                                        }}
                                        title="Annuler la vente"
                                        className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive shrink-0"
                                    >
                                        <XCircle className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}