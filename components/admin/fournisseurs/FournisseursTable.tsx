import { Pencil, Trash2, Truck } from "lucide-react";
import type { Fournisseur } from "@/types/fournisseur";

interface FournisseurCardProps {
    fournisseur: Fournisseur;
    onEdit: (fournisseur: Fournisseur) => void;
    onDelete: (fournisseur: Fournisseur) => void;
}

export default function FournisseurCard({
    fournisseur,
    onEdit,
    onDelete,
}: FournisseurCardProps) {
    const commandes = fournisseur._count?.commandeFournisseurs ?? 0;
    const cannotDelete = commandes > 0;

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">
                        {fournisseur.nom}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                        {fournisseur.email ?? "—"}
                    </p>
                </div>
                <Truck className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
                <p>Téléphone : {fournisseur.telephone ?? "—"}</p>
                <p className="line-clamp-2">Adresse : {fournisseur.adresse ?? "—"}</p>
                <p>Commandes : <span className="tabular-nums">{commandes}</span></p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
                <button
                    type="button"
                    onClick={() => onEdit(fournisseur)}
                    className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                    Modifier
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(fournisseur)}
                    disabled={cannotDelete}
                    title={cannotDelete ? "Impossible de supprimer : commandes liées" : "Supprimer"}
                    className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}