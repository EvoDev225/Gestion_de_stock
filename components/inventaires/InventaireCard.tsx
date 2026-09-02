"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import type { Inventaire } from "@/types/inventaire";

interface InventaireCardProps {
    inventaire: Inventaire;
    onView: (inventaire: Inventaire) => void;
}

// Fonction locale de formatage de date en fr-FR
function formatDate(dateInput: string | Date | undefined | null): string {
    if (!dateInput) return "Date inconnue";
    const date = new Date(dateInput);
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function InventaireCard({
    inventaire,
    onView,
}: InventaireCardProps) {
    const lignes = inventaire.lignesInventaire || [];
    const ecartTotal = lignes.reduce(
        (sum, line) => sum + (line.ecart || 0),
        0
    );

    // Détermination du style et du texte de l'écart total
    let ecartClass = "text-muted-foreground";
    let ecartText = "0";
    if (ecartTotal < 0) {
        ecartClass = "text-destructive";
        ecartText = ecartTotal.toString();
    } else if (ecartTotal > 0) {
        ecartClass = "text-primary";
        ecartText = `+${ecartTotal}`;
    }

    const isValide = inventaire.statut === "valide" || inventaire.statut === "Validé";

    return (
        <div
            onClick={() => onView(inventaire)}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.99] transform duration-150"
        >
            {/* En-tête : Date et Statut */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Date de lancement
                    </span>
                    <span className="text-sm font-semibold text-foreground mt-0.5">
                        {formatDate(inventaire.dateLancement)}
                    </span>
                </div>

                {isValide ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Validé
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                        En cours
                    </span>
                )}
            </div>

            {/* Détails : Lignes et Écart */}
            <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Lignes
                    </span>
                    <span className="text-lg font-bold text-foreground mt-0.5">
                        {lignes.length}
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Écart total
                    </span>
                    <span className={`text-lg font-bold mt-0.5 ${ecartClass}`}>
                        {ecartText}
                    </span>
                </div>
            </div>
        </div>
    );
}