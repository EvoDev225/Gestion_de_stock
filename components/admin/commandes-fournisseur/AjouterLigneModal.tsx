"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import type { Produit, NouvelleLigneCommandeData } from "@/types/commande-fournisseur";

interface AjouterLigneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NouvelleLigneCommandeData) => Promise<void>;
    produits: Produit[];
    isSubmitting: boolean;
}

export default function AjouterLigneModal({
    isOpen,
    onClose,
    onSubmit,
    produits,
    isSubmitting,
}: AjouterLigneModalProps) {
    const [produitId, setProduitId] = useState("");
    const [quantiteCommande, setQuantiteCommande] = useState(0);
    const [prixAchatUnitaire, setPrixAchatUnitaire] = useState(0);
    const [errors, setErrors] = useState<{ produit?: string; quantite?: string; prix?: string }>({});

    const resetForm = useCallback(() => {
        setProduitId("");
        setQuantiteCommande(0);
        setPrixAchatUnitaire(0);
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

    const handleSubmit = async () => {
        const newErrors: { produit?: string; quantite?: string; prix?: string } = {};
        if (!produitId) newErrors.produit = "Veuillez sélectionner un produit.";
        if (Number(quantiteCommande) <= 0) newErrors.quantite = "La quantité doit être supérieure à 0.";
        if (Number(prixAchatUnitaire) <= 0) newErrors.prix = "Le prix unitaire doit être supérieur à 0.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await onSubmit({
            produitId,
            quantiteCommande: Number(quantiteCommande),
            prixAchatUnitaire: Number(prixAchatUnitaire),
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Ajouter une ligne</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="produit" className="block text-sm font-medium text-foreground mb-1">
                            Produit <span className="text-destructive">*</span>
                        </label>
                        <select
                            id="produit"
                            value={produitId}
                            onChange={(e) => setProduitId(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        >
                            <option value="">Sélectionner un produit</option>
                            {produits.map((p) => (
                                <option key={p.id} value={p.id}>{p.nom} ({p.sku})</option>
                            ))}
                        </select>
                        {errors.produit && <p className="mt-1 text-sm text-destructive">{errors.produit}</p>}
                    </div>

                    <div>
                        <label htmlFor="quantite" className="block text-sm font-medium text-foreground mb-1">
                            Quantité <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="quantite"
                            type="number"
                            min={1}
                            value={quantiteCommande || ""}
                            onChange={(e) => setQuantiteCommande(Number(e.target.value))}
                            placeholder="0"
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        />
                        {errors.quantite && <p className="mt-1 text-sm text-destructive">{errors.quantite}</p>}
                    </div>

                    <div>
                        <label htmlFor="prix" className="block text-sm font-medium text-foreground mb-1">
                            Prix unitaire <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="prix"
                            type="number"
                            min={0.01}
                            step={0.01}
                            value={prixAchatUnitaire || ""}
                            onChange={(e) => setPrixAchatUnitaire(Number(e.target.value))}
                            placeholder="0.00"
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        />
                        {errors.prix && <p className="mt-1 text-sm text-destructive">{errors.prix}</p>}
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
                        {isSubmitting ? "Ajout..." : "Ajouter"}
                    </button>
                </div>
            </div>
        </div>
    );
}