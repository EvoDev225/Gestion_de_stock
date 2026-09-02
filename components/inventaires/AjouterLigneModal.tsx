"use client";

import { useState, useEffect } from "react";

interface AjouterLigneModalProps {
    isOpen: boolean;
    onClose: () => void;
    produits: { id: string; nom: string }[];
    onSubmit: (produitId: string, varianteId: string | null) => Promise<void>;
}

export default function AjouterLigneModal({
    isOpen,
    onClose,
    produits,
    onSubmit,
}: AjouterLigneModalProps) {
    const [selectedProduitId, setSelectedProduitId] = useState<string>("");
    const [selectedVarianteId, setSelectedVarianteId] = useState<string>("");
    const [variantes, setVariantes] = useState<{ id: string; nom: string }[]>([]);
    const [isLoadingVariantes, setIsLoadingVariantes] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialisation des états à l'ouverture de la modale
    useEffect(() => {
        if (isOpen) {
            setSelectedProduitId("");
            setSelectedVarianteId("");
            setVariantes([]);
        }
    }, [isOpen]);

    // Chargement des variantes lorsque le produit change
    useEffect(() => {
        if (selectedProduitId) {
            setIsLoadingVariantes(true);
            fetch(`/api/variantes?produitId=${selectedProduitId}`)
                .then((res) => res.json())
                .then((data) => {
                    // Gère le cas où l'API renvoie un tableau direct ou un objet { variantes: [...] }
                    const list = Array.isArray(data) ? data : data.variantes || [];
                    setVariantes(list);
                })
                .catch((err) => {
                    console.error("Erreur lors du chargement des variantes :", err);
                    setVariantes([]);
                })
                .finally(() => {
                    setIsLoadingVariantes(false);
                });
        } else {
            setVariantes([]);
        }
    }, [selectedProduitId]);

    // Gestion de la fermeture via la touche Échap
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    const handleSubmit = async () => {
        if (!selectedProduitId || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(selectedProduitId, selectedVarianteId || null);
            onClose();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la ligne :", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay avec fermeture au clic */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panneau de la modale */}
            <div className="relative z-10 w-full max-w-sm rounded-xl bg-card p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                    Ajouter une ligne
                </h2>

                <div className="space-y-4">
                    {/* Sélection du Produit (Obligatoire) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Produit <span className="text-destructive">*</span>
                        </label>
                        <select
                            value={selectedProduitId}
                            onChange={(e) => setSelectedProduitId(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                            <option value="">Sélectionner un produit</option>
                            {produits.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sélection de la Variante (Optionnel, conditionnel) */}
                    {selectedProduitId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Variante <span className="text-muted-foreground font-normal">(optionnel)</span>
                            </label>
                            {isLoadingVariantes ? (
                                <div className="text-sm text-muted-foreground animate-pulse">
                                    Chargement des variantes...
                                </div>
                            ) : (
                                <select
                                    value={selectedVarianteId}
                                    onChange={(e) => setSelectedVarianteId(e.target.value)}
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                >
                                    <option value="">Aucune variante (produit principal)</option>
                                    {variantes.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.nom}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer avec actions */}
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none text-sm font-medium"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedProduitId || isSubmitting}
                        className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none text-sm font-medium"
                    >
                        {isSubmitting ? "Ajout..." : "Ajouter"}
                    </button>
                </div>
            </div>
        </div>
    );
}