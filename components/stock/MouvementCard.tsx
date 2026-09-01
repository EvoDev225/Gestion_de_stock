"use client";

import type { MouvementStock } from "@/types/mouvement";
import { TYPE_MOUVEMENT_CONFIG } from "@/types/mouvement";

interface MouvementCardProps {
    mouvement: MouvementStock;
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
        return <span className="font-medium text-primary">+{qty}</span>;
    }
    if (type === "SORTIE" || type === "PERTE" || type === "DOMMAGE") {
        return <span className="font-medium text-destructive">-{qty}</span>;
    }
    return <span className="font-medium text-foreground">{qty}</span>;
}

export default function MouvementCard({ mouvement }: MouvementCardProps) {
    const config = TYPE_MOUVEMENT_CONFIG[mouvement.typeMouvement] || {
        label: mouvement.typeMouvement,
        badgeClass: "bg-muted text-muted-foreground",
    };

    const productName = mouvement.variante?.nomVariante ?? mouvement.produit?.nom ?? "—";
    const lotNumber = mouvement.lot?.numeroLot ?? "—";
    const userName = mouvement.utilisateur?.nom ?? mouvement.utilisateur?.email ?? "—";

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
            {/* ── Ligne du haut : Produit/Date + Badge Type ── */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium text-sm text-foreground truncate">
                        {productName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatDateTime(mouvement.dateMouvement)}
                    </span>
                </div>
                <span
                    className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.badgeClass}`}
                >
                    {config.label}
                </span>
            </div>

            {/* ── Ligne du bas : Quantité, Lot, Utilisateur ── */}
            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border">
                <div className="flex flex-col gap-1">
                    <span>Qté : {getQuantityDisplay(mouvement)}</span>
                    <span className="font-mono">Lot : {lotNumber}</span>
                </div>
                <div className="text-right truncate max-w-[120px]" title={userName}>
                    {userName}
                </div>
            </div>

            {/* ── Motif (optionnel) ── */}
            {mouvement.motif && (
                <div className="pt-1 text-xs text-muted-foreground italic border-t border-border mt-1">
                    Motif : {mouvement.motif}
                </div>
            )}
        </div>
    );
}