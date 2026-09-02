"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface NouvelInventaireModalProps {
    isOpen: boolean;
    onClose: () => void;
    produits: { id: string; nom: string; sku: string }[];
    onSubmit: (produitIds: string[]) => Promise<void>;
}

export default function NouvelInventaireModal({
    isOpen,
    onClose,
    produits,
    onSubmit,
}: NouvelInventaireModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleToggleProduct = (produitId: string) => {
        setSelectedIds((prev) =>
            prev.includes(produitId)
                ? prev.filter((id) => id !== produitId)
                : [...prev, produitId]
        );
    };

    const handleToggleAll = () => {
        if (selectedIds.length === produits.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(produits.map((p) => p.id));
        }
    };

    const handleSubmit = async () => {
        if (selectedIds.length === 0 || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(selectedIds);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la création de l'inventaire:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAllSelected = selectedIds.length === produits.length && produits.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panneau */}
            <div className="relative w-full max-w-lg bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">
                        Nouvel inventaire
                    </h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Corps */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                        Sélectionner les produits à inventorier
                    </h3>

                    {/* Checkbox "Tout sélectionner" */}
                    <div className="mb-4 pb-4 border-b border-border">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={handleToggleAll}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                Tout sélectionner
                            </span>
                        </label>
                    </div>

                    {/* Liste des produits */}
                    <div className="space-y-2">
                        {produits.map((produit) => (
                            <label
                                key={produit.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(produit.id)}
                                    onChange={() => handleToggleProduct(produit.id)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-foreground truncate">
                                        {produit.nom}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        SKU: {produit.sku}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>

                    {produits.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            Aucun produit disponible
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedIds.length === 0 || isSubmitting}
                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? "Création..." : "Lancer l'inventaire"}
                    </button>
                </div>
            </div>
        </div>
    );
}