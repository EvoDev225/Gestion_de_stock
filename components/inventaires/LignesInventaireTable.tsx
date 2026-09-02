"use client";

import { useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import type { LigneInventaire } from "@/types/inventaire";

interface LignesInventaireTableProps {
    lignes: LigneInventaire[];
    editable: boolean;
    onQuantitePhysiqueChange: (ligneId: string, valeur: number) => void;
    onJustificationChange: (ligneId: string, valeur: string) => void;
}

export default function LignesInventaireTable({
    lignes,
    editable,
    onQuantitePhysiqueChange,
    onJustificationChange,
}: LignesInventaireTableProps) {
    // État local pour un retour visuel immédiat avant que le parent ne re-rende
    const [quantites, setQuantites] = useState<Record<string, number>>({});
    const [justifications, setJustifications] = useState<Record<string, string>>({});

    // Synchronisation initiale et mise à jour si les lignes changent (ex: après un chargement)
    useEffect(() => {
        const initialQuantites: Record<string, number> = {};
        const initialJustifications: Record<string, string> = {};

        lignes.forEach((ligne) => {
            initialQuantites[ligne.id] = ligne.quantitePhysique ?? 0;
            initialJustifications[ligne.id] = ligne.justification ?? "";
        });

        setQuantites(initialQuantites);
        setJustifications(initialJustifications);
    }, [lignes]);

    // État vide
    if (!lignes || lignes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
                <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">
                    Aucune ligne dans cet inventaire
                </p>
            </div>
        );
    }

    const handleQuantiteChange = (ligneId: string, valeur: string) => {
        const numValue = valeur === "" ? 0 : Number(valeur);
        setQuantites((prev) => ({ ...prev, [ligneId]: numValue }));
        onQuantitePhysiqueChange(ligneId, numValue);
    };

    const handleJustificationChange = (ligneId: string, valeur: string) => {
        setJustifications((prev) => ({ ...prev, [ligneId]: valeur }));
        onJustificationChange(ligneId, valeur);
    };

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Produit / Variante
                        </th>
                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                            Qté théorique
                        </th>
                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                            Qté physique
                        </th>
                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                            Écart
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Justification
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lignes.map((ligne) => {
                        const qtyPhysique = quantites[ligne.id] ?? ligne.quantitePhysique ?? 0;
                        const qtyTheorique = ligne.quantiteTheorique ?? 0;
                        const ecart = qtyPhysique - qtyTheorique;
                        const justification = justifications[ligne.id] ?? ligne.justification ?? "";

                        // Détermination du style de l'écart
                        let ecartClass = "text-muted-foreground";
                        let ecartText = "0";
                        if (ecart < 0) {
                            ecartClass = "text-destructive";
                            ecartText = ecart.toString();
                        } else if (ecart > 0) {
                            ecartClass = "text-primary";
                            ecartText = `+${ecart}`;
                        }

                        // Logique d'affichage imbriqué Produit/Variante
                        const nomVariante = ligne.variante?.nomVariante;
                        const nomProduit = ligne.produit?.nom || ligne.produit?.nom;

                        return (
                            <tr
                                key={ligne.id}
                                className="border-b border-border transition-colors hover:bg-muted/30"
                            >
                                {/* Colonne 1 : Produit / Variante */}
                                <td className="p-4 align-middle">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {nomVariante || nomProduit || "Produit inconnu"}
                                        </span>
                                        {nomVariante && nomProduit && (
                                            <span className="text-xs text-muted-foreground mt-0.5">
                                                {nomProduit}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Colonne 2 : Quantité théorique */}
                                <td className="p-4 align-middle text-center font-medium text-foreground">
                                    {qtyTheorique}
                                </td>

                                {/* Colonne 3 : Quantité physique */}
                                <td className="p-4 align-middle text-center">
                                    {editable ? (
                                        <input
                                            type="number"
                                            min="0"
                                            value={qtyPhysique}
                                            onChange={(e) => handleQuantiteChange(ligne.id, e.target.value)}
                                            className="w-24 rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        />
                                    ) : (
                                        <span className="font-medium text-foreground">{qtyPhysique}</span>
                                    )}
                                </td>

                                {/* Colonne 4 : Écart (calculé en live) */}
                                <td className={`p-4 align-middle text-center font-bold ${ecartClass}`}>
                                    {ecartText}
                                </td>

                                {/* Colonne 5 : Justification */}
                                <td className="p-4 align-middle">
                                    {editable ? (
                                        <input
                                            type="text"
                                            value={justification}
                                            onChange={(e) => handleJustificationChange(ligne.id, e.target.value)}
                                            placeholder="Optionnel"
                                            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                                        />
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            {justification || "—"}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}