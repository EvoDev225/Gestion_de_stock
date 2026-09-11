import type { Retour } from "@/types/retour";
import RetourTypeBadge from "./RetourTypeBadge";

interface RetourCardProps {
    retour: Retour;
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

export default function RetourCard({ retour }: RetourCardProps) {
    const quantiteTotale = retour.lignesRetour.reduce((total, l) => total + l.quantite, 0);

    return (
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
                <RetourTypeBadge type={retour.typeRetour} />
                <span className="text-xs text-muted-foreground">{formaterDate(retour.dateRetour)}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{referenceRetour(retour)}</p>
            <p className="text-sm text-muted-foreground">
                {retour.lignesRetour.length} ligne(s) · {quantiteTotale} unité(s)
            </p>
            {retour.motif && <p className="text-sm text-muted-foreground">Motif : {retour.motif}</p>}
            <p className="text-xs text-muted-foreground">Par {retour.utilisateur.nom}</p>
        </div>
    );
}