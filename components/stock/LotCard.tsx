"use client";

import { Pencil, Trash2, AlertCircle, Clock } from "lucide-react";
import type { Lot } from "@/types/lot";

interface LotCardProps {
    lot: Lot;
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

export default function LotCard({ lot, onEdit, onDelete }: LotCardProps) {
    const daysUntilExpiration = lot.dateExpiration
        ? getDaysUntil(lot.dateExpiration)
        : null;

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            {/* ── Ligne du haut : Numéro + Produit + Actions ── */}
            <div className="flex justify-between items-start gap-3">
                {/* Gauche : Infos */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="font-mono text-sm font-medium text-foreground">
                        {lot.numeroLot}
                    </span>
                    {lot.variante ? (
                        <span className="text-xs text-muted-foreground truncate">
                            {lot.variante.nomVariante} — {lot.produit?.nom}
                        </span>
                    ) : (
                        <span className="text-xs text-muted-foreground truncate">
                            {lot.produit?.nom ?? "—"}
                        </span>
                    )}
                </div>

                {/* Droite : Actions */}
                <div className="flex items-center gap-1 shrink-0">
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
            </div>

            {/* ── Ligne du bas : Quantité + Expiration ── */}
            <div className="flex justify-between items-center pt-2 border-t border-border text-sm">
                <span className="text-muted-foreground">
                    Qté: <span className="font-medium text-foreground">{lot.quantite}</span>
                </span>

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
            </div>
        </div>
    );
}