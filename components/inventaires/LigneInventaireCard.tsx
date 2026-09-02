"use client";

import { useState, useEffect } from "react";
import type { LigneInventaire } from "@/types/inventaire";

interface LigneInventaireCardProps {
    ligne: LigneInventaire;
    editable: boolean;
    onQuantitePhysiqueChange: (ligneId: string, valeur: number) => void;
    onJustificationChange: (ligneId: string, valeur: string) => void;
}

export default function LigneInventaireCard({
    ligne,
    editable,
    onQuantitePhysiqueChange,
    onJustificationChange,
}: LigneInventaireCardProps) {
    // État local pour un retour visuel immédiat à la frappe
    const [localQty, setLocalQty] = useState<number>(ligne.quantitePhysique ?? 0);
    const [localJustif, setLocalJustif] = useState<string>(ligne.justification ?? "");

    // Synchronisation si la ligne change (ex: après une sauvegarde ou un rechargement)
    useEffect(() => {
        setLocalQty(ligne.quantitePhysique ?? 0);
        setLocalJustif(ligne.justification ?? "");
    }, [ligne.quantitePhysique, ligne.justification, ligne.id]);

    const qtyTheorique = ligne.quantiteTheorique ?? 0;
    const ecart = localQty - qtyTheorique;

    // Détermination du style et du texte de l'écart
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

    const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value === "" ? 0 : Number(e.target.value);
        setLocalQty(val);
        onQuantitePhysiqueChange(ligne.id, val);
    };

    const handleJustifChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalJustif(val);
        onJustificationChange(ligne.id, val);
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4">
            {/* En-tête : Produit / Variante */}
            <div className="flex flex-col">
                <span className="text-base font-semibold text-foreground">
                    {nomVariante || nomProduit || "Produit inconnu"}
                </span>
                {nomVariante && nomProduit && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                        {nomProduit}
                    </span>
                )}
            </div>

            {/* Grille 2 colonnes : Théorique / Physique */}
            <div className="grid grid-cols-2 gap-4">
                {/* Quantité Théorique */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Théorique
                    </span>
                    <span className="text-lg font-bold text-foreground">
                        {qtyTheorique}
                    </span>
                </div>

                {/* Quantité Physique */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Physique
                    </span>
                    {editable ? (
                        <input
                            type="number"
                            min="0"
                            value={localQty === 0 ? "" : localQty}
                            onChange={handleQtyChange}
                            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-center text-lg font-bold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                            placeholder="0"
                        />
                    ) : (
                        <span className="text-lg font-bold text-foreground">
                            {localQty}
                        </span>
                    )}
                </div>
            </div>

            {/* Écart (calculé en live) */}
            <div className="flex items-center justify-center gap-2 py-1 border-t border-border pt-3">
                <span className="text-sm font-medium text-muted-foreground">Écart :</span>
                <span className={`text-lg font-bold ${ecartClass}`}>
                    {ecartText}
                </span>
            </div>

            {/* Justification (si editable) */}
            {editable && (
                <div className="flex flex-col gap-1 pt-1">
                    <label htmlFor={`justif-${ligne.id}`} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Justification
                    </label>
                    <input
                        id={`justif-${ligne.id}`}
                        type="text"
                        value={localJustif}
                        onChange={handleJustifChange}
                        placeholder="Optionnel"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                    />
                </div>
            )}
        </div>
    );
}