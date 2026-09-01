"use client";

import { AlertCircle, Clock, Pencil, Trash2, PackageOpen } from "lucide-react";
import type { Lot } from "@/types/lot";

interface LotsTableProps {
    lots: Lot[];
    onEdit: (lot: Lot) => void;
    onDelete: (lot: Lot) => void;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("fr-FR");
}

function getDaysUntil(dateString: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function LotsTable({ lots, onEdit, onDelete }: LotsTableProps) {
    return (
        <div className="hidden lg:block rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th className="py-3 px-6">Numéro de lot</th>
                        <th className="py-3 px-6">Produit / Variante</th>
                        <th className="py-3 px-6">Quantité</th>
                        <th className="py-3 px-6">Date de réception</th>
                        <th className="py-3 px-6">Date d'expiration</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lots.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-12 px-6 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <PackageOpen className="h-10 w-10 opacity-50" aria-hidden="true" />
                                    <span className="text-sm font-medium">Aucun lot trouvé</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        lots.map((lot) => {
                            const daysUntilExpiration = lot.dateExpiration
                                ? getDaysUntil(lot.dateExpiration)
                                : null;

                            return (
                                <tr
                                    key={lot.id}
                                    className="border-b border-border transition-colors hover:bg-muted/30"
                                >
                                    {/* Numéro de lot */}
                                    <td className="py-3 px-6 font-mono text-sm text-foreground">
                                        {lot.numeroLot}
                                    </td>

                                    {/* Produit / Variante */}
                                    <td className="py-3 px-6">
                                        {lot.variante ? (
                                            <>
                                                <div className="font-medium text-sm text-foreground">
                                                    {lot.variante.nomVariante}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {lot.produit?.nom}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="font-medium text-sm text-foreground">
                                                {lot.produit?.nom ?? "—"}
                                            </div>
                                        )}
                                    </td>

                                    {/* Quantité */}
                                    <td className="py-3 px-6 text-sm text-foreground">
                                        {lot.quantite}
                                    </td>

                                    {/* Date de réception */}
                                    <td className="py-3 px-6 text-sm text-muted-foreground">
                                        {lot.dateReception ? formatDate(lot.dateReception) : "—"}
                                    </td>

                                    {/* Date d'expiration */}
                                    <td className="py-3 px-6">
                                        {lot.dateExpiration ? (
                                            daysUntilExpiration !== null && daysUntilExpiration < 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                                                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                                    {formatDate(lot.dateExpiration)}
                                                </span>
                                            ) : daysUntilExpiration !== null && daysUntilExpiration <= 30 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600">
                                                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                                                    {formatDate(lot.dateExpiration)}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDate(lot.dateExpiration)}
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-sm text-muted-foreground">—</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3 px-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(lot)}
                                                title="Modifier"
                                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                            >
                                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(lot)}
                                                title="Supprimer"
                                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        </div>
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