"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { Categorie } from "@/types/produit";

interface CategorieFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categorie: Categorie | null;
    onSubmit: (data: { nom: string; description: string }) => Promise<void>;
}

export default function CategorieFormModal({
    isOpen,
    onClose,
    categorie,
    onSubmit,
}: CategorieFormModalProps) {
    const [nom, setNom] = useState(categorie?.nom ?? "");
    const [description, setDescription] = useState(categorie?.description ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!nom.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmit({ nom: nom.trim(), description: description.trim() });
            onClose();
        } catch (error) {
            console.error("Erreur lors de la soumission de la catégorie :", error);
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
            <div
                className="w-full max-w-md bg-card h-full shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">
                        {categorie ? "Modifier la catégorie" : "Nouvelle catégorie"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nom" className="text-sm font-medium text-foreground">
                                Nom
                            </label>
                            <input
                                id="nom"
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="description" className="text-sm font-medium text-foreground">
                                Description (optionnel)
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex justify-end gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !nom.trim()}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}