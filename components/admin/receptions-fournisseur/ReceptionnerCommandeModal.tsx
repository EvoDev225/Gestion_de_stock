"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";

interface LigneAvecRestant {
    id: string;
    produit: { nom: string; sku: string };
    quantiteCommande: number;
    quantiteRecue: number;
}

interface ReceptionnerCommandeModalProps {
    isOpen: boolean;
    onClose: () => void;
    lignes: LigneAvecRestant[];
    onSubmit: (lignes: { ligneCommandeFournisseurId: string; quantiteRecue: number }[]) => Promise<void>;
}

export default function ReceptionnerCommandeModal({
    isOpen,
    onClose,
    lignes,
    onSubmit,
}: ReceptionnerCommandeModalProps) {
    const [quantites, setQuantites] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const lignesAvecRestant = useMemo(
        () => lignes.map((l) => ({ ...l, restant: l.quantiteCommande - l.quantiteRecue })).filter((l) => l.restant > 0),
        [lignes]
    );

    if (!isOpen) return null;

    const handleQuantiteChange = (ligneId: string, valeur: number, max: number) => {
        setQuantites((prev) => ({ ...prev, [ligneId]: Math.max(0, Math.min(valeur, max)) }));
    };

    const lignesAvecSaisie = lignesAvecRestant
        .map((l) => ({ ligneCommandeFournisseurId: l.id, quantiteRecue: quantites[l.id] ?? 0 }))
        .filter((l) => l.quantiteRecue > 0);

    const handleSubmit = async () => {
        if (lignesAvecSaisie.length === 0) return;
        setIsSubmitting(true);
        try {
            await onSubmit(lignesAvecSaisie);
            setQuantites({});
            onClose();
        } catch (error) {
            console.error("Erreur lors de la réception :", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-lg bg-card h-full shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">Réceptionner la commande</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors" aria-label="Fermer">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {lignesAvecRestant.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            Toutes les lignes de cette commande ont déjà été entièrement reçues.
                        </p>
                    ) : (
                        lignesAvecRestant.map((ligne) => (
                            <div key={ligne.id} className="flex items-center justify-between gap-4 border border-border rounded-lg p-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-foreground truncate">{ligne.produit.nom}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Restant à recevoir : {ligne.restant} / {ligne.quantiteCommande}
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    min={0}
                                    max={ligne.restant}
                                    value={quantites[ligne.id] ?? 0}
                                    onChange={(e) => handleQuantiteChange(ligne.id, Number(e.target.value), ligne.restant)}
                                    className="w-20 rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="px-6 py-4 border-t border-border flex justify-end gap-4 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors">
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || lignesAvecSaisie.length === 0}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSubmitting ? "Enregistrement..." : "Réceptionner"}
                    </button>
                </div>
            </div>
        </div>
    );
}