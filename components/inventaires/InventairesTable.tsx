"use client";

import { PackageOpen, Clock, CheckCircle2 } from "lucide-react";
import type { Inventaire } from "@/types/inventaire";

interface InventairesTableProps {
    inventaires: Inventaire[];
    onView: (inventaire: Inventaire) => void;
}

// Fonction locale de formatage de date en fr-FR
function formatDate(dateInput: string | Date | undefined | null): string {
    if (!dateInput) return "—";
    const date = new Date(dateInput);
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Fonction locale pour formater l'ID utilisateur
function formatUserId(userId: string | undefined | null): string {
    if (!userId) return "—";
    return `Utilisateur #${userId.slice(0, 8)}`;
}

export default function InventairesTable({
    inventaires,
    onView,
}: InventairesTableProps) {
    // État vide
    if (!inventaires || inventaires.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
                <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">
                    Aucun inventaire trouvé
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Date lancement
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Lancé par
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Statut
                        </th>
                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                            Lignes
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Écart total
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Validé par
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {inventaires.map((inventaire) => {
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

                        const isValide = inventaire.statut === "VALIDE";

                        return (
                            <tr
                                key={inventaire.id}
                                onClick={() => onView(inventaire)}
                                className="border-b border-border transition-colors hover:bg-muted/30 cursor-pointer"
                            >
                                <td className="p-4 align-middle whitespace-nowrap">
                                    {formatDate(inventaire.dateLancement)}
                                </td>
                                <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                                    {formatUserId(inventaire.utilisateurId)}
                                </td>
                                <td className="p-4 align-middle">
                                    {isValide ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Validé
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                                            <Clock className="h-3.5 w-3.5" />
                                            En cours
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 align-middle text-center font-medium">
                                    {lignes.length}
                                </td>
                                <td className={`p-4 align-middle text-right font-medium ${ecartClass}`}>
                                    {ecartText}
                                </td>
                                <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                                    {formatUserId(inventaire.utilisateurValidateurId)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}