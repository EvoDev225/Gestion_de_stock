"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Vente } from "@/types/vente";

interface VenteDetailModalProps {
    isOpen: boolean;
    vente: Vente | null;
    onClose: () => void;
}

export default function VenteDetailModal({
    isOpen,
    vente,
    onClose,
}: VenteDetailModalProps) {
    if (!isOpen || vente === null) return null;

    const formatCurrency = (montant: number | string) => {
        const val = typeof montant === "string" ? parseFloat(montant) : montant;
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(isNaN(val) ? 0 : val);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatExpirationDate = (dateString: string | null | undefined) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        return `Exp. ${date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Détail de la vente</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Corps scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Bloc résumé */}
                    <div className="bg-muted/30 border border-border rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-xs font-medium text-muted-foreground">Date de la vente</span>
                            <span className="text-foreground font-medium">{formatDate(vente.dateVente)}</span>
                        </div>

                        <div>
                            <span className="block text-xs font-medium text-muted-foreground">Client</span>
                            {vente.client ? (
                                <div>
                                    <span className="text-foreground font-medium">{vente.client.nom}</span>
                                    {vente.client.telephone && (
                                        <span className="block text-xs text-muted-foreground">{vente.client.telephone}</span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-muted-foreground italic">Client anonyme</span>
                            )}
                        </div>

                        <div>
                            <span className="block text-xs font-medium text-muted-foreground">Vendeur</span>
                            <span className="text-foreground font-medium">{vente.utilisateur?.nom ?? "—"}</span>
                        </div>

                        <div>
                            <span className="block text-xs font-medium text-muted-foreground">Statut</span>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                    vente.statut === "VALIDEE"
                                        ? "bg-primary/10 text-primary"
                                        : "bg-muted/50 text-muted-foreground"
                                }`}
                            >
                                {vente.statut === "VALIDEE" ? "Validée" : "Annulée"}
                            </span>
                        </div>

                        <div className="sm:col-span-2">
                            <span className="block text-xs font-medium text-muted-foreground mb-1">Mode de paiement</span>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    vente.modePaiement === "TOTAL"
                                        ? "bg-accent-subtle text-accent-hover"
                                        : "bg-warning/10 text-warning"
                                }`}
                            >
                                {vente.modePaiement === "TOTAL" ? "Total" : "Crédit"}
                            </span>
                        </div>
                    </div>

                    {/* Tableau des lignes de vente */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Articles vendus</h3>
                        <div className="border border-border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Produit / Variante / Lot</th>
                                            <th className="px-4 py-3 font-medium text-center">Qté</th>
                                            <th className="px-4 py-3 font-medium text-right">P.U.</th>
                                            <th className="px-4 py-3 font-medium text-right">Sous-total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {vente.ligneVentes?.map((ligne, index) => {
                                            const prixUnit = parseFloat(String(ligne.prixUnitaire)) || 0;
                                            const sousTotal = ligne.quantite * prixUnit;
                                            const expirationText = formatExpirationDate(ligne.lot?.dateExpiration);

                                            return (
                                                <tr key={ligne.id || index} className="hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 space-y-0.5">
                                                        <div className="font-medium text-foreground">
                                                            {ligne.produit?.nom}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            SKU: {ligne.produit?.sku}
                                                        </div>
                                                        {ligne.variante && (
                                                            <div className="text-xs text-primary font-medium">
                                                                Variante : {ligne.variante.nomVariante}
                                                            </div>
                                                        )}
                                                        {ligne.lot && (
                                                            <div className="text-xs text-muted-foreground">
                                                                Lot : {ligne.lot.numeroLot} {expirationText && `(${expirationText})`}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-foreground font-medium align-middle">
                                                        <div className="inline-flex items-center gap-1.5 justify-center">
                                                            <span>{ligne.quantite}</span>
                                                            {ligne.stockInsuffisantConfirme && (
                                                                <span
                                                                    title="Vendu malgré un stock insuffisant"
                                                                    className="inline-flex items-center p-0.5 rounded bg-warning/10 text-warning"
                                                                >
                                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-muted-foreground align-middle">
                                                        {formatCurrency(prixUnit)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-foreground align-middle">
                                                        {formatCurrency(sousTotal)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer sticky */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card">
                    <div className="text-sm font-medium text-muted-foreground">
                        Montant total :{" "}
                        <span className="text-foreground text-base font-bold">
                            {formatCurrency(vente.montantTotal)}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}