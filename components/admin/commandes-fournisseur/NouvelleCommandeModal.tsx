"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, X } from "lucide-react";
import type {
    Fournisseur,
    Produit,
    NouvelleLigneCommandeData,
    NouvelleCommandeData,
} from "@/types/commande-fournisseur";

interface NouvelleCommandeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NouvelleCommandeData) => Promise<void>;
    fournisseurs: Fournisseur[];
    produits: Produit[];
    isSubmitting: boolean;
}

const emptyLigne: NouvelleLigneCommandeData = {
    produitId: "",
    quantiteCommande: 0,
    prixAchatUnitaire: 0,
};

function formatMontant(montant: number): string {
    return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
}

export default function NouvelleCommandeModal({
    isOpen,
    onClose,
    onSubmit,
    fournisseurs,
    produits,
    isSubmitting,
}: NouvelleCommandeModalProps) {
    const [fournisseurId, setFournisseurId] = useState("");
    const [lignes, setLignes] = useState<NouvelleLigneCommandeData[]>([{ ...emptyLigne }]);
    const [errors, setErrors] = useState<{ fournisseur?: string; lignes?: string }>({});

    const resetForm = useCallback(() => {
        setFournisseurId("");
        setLignes([{ ...emptyLigne }]);
        setErrors({});
    }, []);

    useEffect(() => {
        if (isOpen) resetForm();
    }, [isOpen, resetForm]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isSubmitting) onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
    };

    const addLigne = () => setLignes((prev) => [...prev, { ...emptyLigne }]);
    const removeLigne = (index: number) => setLignes((prev) => prev.filter((_, i) => i !== index));

    const updateLigne = (index: number, field: keyof NouvelleLigneCommandeData, value: string | number) => {
        setLignes((prev) =>
            prev.map((ligne, i) => {
                if (i !== index) return ligne;
                if (field === "produitId") return { ...ligne, produitId: value as string };
                return { ...ligne, [field]: Number(value) };
            })
        );
    };

    const total = lignes.reduce((sum, ligne) => {
        const qty = Number(ligne.quantiteCommande) || 0;
        const price = Number(ligne.prixAchatUnitaire) || 0;
        return sum + qty * price;
    }, 0);

    const handleSubmit = async () => {
        const newErrors: { fournisseur?: string; lignes?: string } = {};

        if (!fournisseurId) newErrors.fournisseur = "Veuillez sélectionner un fournisseur.";

        const validLignes = lignes.filter(
            (l) => l.produitId && Number(l.quantiteCommande) > 0 && Number(l.prixAchatUnitaire) > 0
        );

        if (validLignes.length === 0) {
            newErrors.lignes = "Ajoutez au moins une ligne valide (produit, quantité > 0, prix > 0).";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await onSubmit({ fournisseurId, lignes: validLignes });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Nouvelle commande fournisseur</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <label htmlFor="fournisseur" className="block text-sm font-medium text-foreground mb-1">
                            Fournisseur <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="fournisseur"
                            value={fournisseurId}
                            onChange={(e) => setFournisseurId(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        >
                            <option value="">Sélectionner un fournisseur</option>
                            {fournisseurs.map((f) => (
                                <option key={f.id} value={f.id}>{f.nom}</option>
                            ))}
                        </select>
                        {errors.fournisseur && <p className="mt-1 text-sm text-destructive">{errors.fournisseur}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-foreground">Lignes de commande</h3>
                            <button
                                type="button"
                                onClick={addLigne}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/70"
                            >
                                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                                Ajouter une ligne
                            </button>
                        </div>

                        {errors.lignes && <p className="mb-3 text-sm text-destructive">{errors.lignes}</p>}

                        <div className="space-y-4">
                            {lignes.map((ligne, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end p-4 bg-muted/30 rounded-lg border border-border"
                                >
                                    <div className="sm:col-span-5">
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Produit</label>
                                        <select
                                            value={ligne.produitId}
                                            onChange={(e) => updateLigne(index, "produitId", e.target.value)}
                                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                                        >
                                            <option value="">Sélectionner</option>
                                            {produits.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nom} ({p.sku})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Quantité</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={ligne.quantiteCommande || ""}
                                            onChange={(e) => updateLigne(index, "quantiteCommande", e.target.value)}
                                            placeholder="0"
                                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Prix unitaire</label>
                                        <input
                                            type="number"
                                            min={0.01}
                                            step={0.01}
                                            value={ligne.prixAchatUnitaire || ""}
                                            onChange={(e) => updateLigne(index, "prixAchatUnitaire", e.target.value)}
                                            placeholder="0.00"
                                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Total</label>
                                        <p className="text-sm font-semibold text-foreground pt-2">
                                            {formatMontant((Number(ligne.quantiteCommande) || 0) * (Number(ligne.prixAchatUnitaire) || 0))}
                                        </p>
                                    </div>

                                    <div className="sm:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeLigne(index)}
                                            disabled={lignes.length === 1}
                                            title={lignes.length === 1 ? "Impossible de supprimer la seule ligne" : "Supprimer la ligne"}
                                            className="rounded p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end items-center pt-4 border-t border-border">
                        <p className="text-lg font-bold text-foreground">
                            Total général : <span className="text-primary">{formatMontant(total)}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Création..." : "Créer la commande"}
                    </button>
                </div>
            </div>
        </div>
    );
}