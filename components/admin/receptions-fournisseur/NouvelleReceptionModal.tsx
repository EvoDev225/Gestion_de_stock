"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { X, Package, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type {
    LigneRestante,
    ReceptionFournisseur,
} from "@/types/reception-fournisseur";

interface NouvelleReceptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    commandeFournisseurId: string;
    lignesRestantes: LigneRestante[];
    onSuccess: (reception: ReceptionFournisseur) => void;
}

export default function NouvelleReceptionModal({
    isOpen,
    onClose,
    commandeFournisseurId,
    lignesRestantes,
    onSuccess,
}: NouvelleReceptionModalProps) {
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Réinitialisation des états à l'ouverture
    useEffect(() => {
        if (isOpen) {
            const initialQuantities: Record<string, number> = {};
            lignesRestantes.forEach((l) => {
                initialQuantities[l.ligneCommandeFournisseurId] = 0;
            });
            setQuantities(initialQuantities);
            setErrors({});
            setGlobalError(null);
            setIsSubmitting(false);
        }
    }, [isOpen, lignesRestantes]);

    // Fermeture avec la touche Échap
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isSubmitting) onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, isSubmitting, onClose]);

    const handleQuantityChange = (id: string, value: string) => {
        const parsed = value === "" ? 0 : parseInt(value, 10);
        const safeValue = isNaN(parsed) ? 0 : Math.max(0, parsed);

        setQuantities((prev) => ({ ...prev, [id]: safeValue }));

        // Nettoyage de l'erreur inline si l'utilisateur corrige
        if (errors[id]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };

    // Validation côté client
    const isFormValid = useMemo(() => {
        let hasAtLeastOne = false;
        const newErrors: Record<string, string> = {};

        for (const ligne of lignesRestantes) {
            const qty = quantities[ligne.ligneCommandeFournisseurId] || 0;

            if (qty > 0) hasAtLeastOne = true;

            if (qty > ligne.quantiteRestante) {
                newErrors[ligne.ligneCommandeFournisseurId] = `Max: ${ligne.quantiteRestante}`;
            }
        }

        setErrors(newErrors);
        return hasAtLeastOne && Object.keys(newErrors).length === 0;
    }, [lignesRestantes, quantities]);

    const handleSubmit = async () => {
        if (!isFormValid || isSubmitting) return;

        setIsSubmitting(true);
        setGlobalError(null);

        const payload = {
            commandeFournisseurId,
            lignes: lignesRestantes
                .filter((l) => (quantities[l.ligneCommandeFournisseurId] || 0) > 0)
                .map((l) => ({
                    ligneCommandeFournisseurId: l.ligneCommandeFournisseurId,
                    quantiteRecue: quantities[l.ligneCommandeFournisseurId] || 0,
                })),
        };

        try {
            const res = await fetch("/api/receptions-fournisseur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                // Lecture stricte de result.error
                setGlobalError(result.error || "Une erreur inconnue est survenue.");
                return;
            }

            onSuccess(result as ReceptionFournisseur);
            onClose();
        } catch {
            setGlobalError("Erreur de connexion au serveur. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-card border border-border rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Nouvelle réception
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Saisissez les quantités reçues
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="p-2 rounded-md text-muted-foreground hover:bg-muted/30 transition-colors disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {globalError && (
                                <div className="flex items-start gap-3 p-4 mb-5 rounded-md bg-destructive/10 border border-destructive/20">
                                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-sm text-destructive font-medium">
                                        {globalError}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                {lignesRestantes.map((ligne) => {
                                    const currentQty = quantities[ligne.ligneCommandeFournisseurId] || 0;
                                    const hasError = !!errors[ligne.ligneCommandeFournisseurId];
                                    const isDisabled = ligne.quantiteRestante === 0;

                                    return (
                                        <div
                                            key={ligne.ligneCommandeFournisseurId}
                                            className="p-4 rounded-lg border border-border bg-muted/30"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                {/* Infos Produit */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-foreground font-medium truncate">
                                                            {ligne.produitNom}
                                                        </h4>
                                                        <span className="text-xs text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                                                            {ligne.produitSku}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                        <span>Commandée : <strong className="text-foreground">{ligne.quantiteCommande}</strong></span>
                                                        <span>Déjà reçue : <strong className="text-foreground">{ligne.quantiteDejaRecue}</strong></span>
                                                        <span>Restante : <strong className="text-primary">{ligne.quantiteRestante}</strong></span>
                                                    </div>
                                                </div>

                                                {/* Input Quantité */}
                                                <div className="w-full sm:w-32 shrink-0">
                                                    <label className="sr-only">
                                                        Quantité à recevoir pour {ligne.produitNom}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={ligne.quantiteRestante}
                                                        step="1"
                                                        value={currentQty}
                                                        disabled={isDisabled || isSubmitting}
                                                        onChange={(e) =>
                                                            handleQuantityChange(
                                                                ligne.ligneCommandeFournisseurId,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full px-3 py-2 rounded-md border text-foreground text-sm bg-card transition-colors
                                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${hasError ? "border-destructive" : "border-border"}`}
                                                        placeholder="0"
                                                    />
                                                    {hasError && (
                                                        <p className="text-destructive text-xs mt-1.5 font-medium">
                                                            {errors[ligne.ligneCommandeFournisseurId]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-muted/30/50">
                            <button
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-md text-foreground font-medium text-sm bg-muted/50 hover:bg-muted/30 border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className="px-4 py-2 rounded-md text-primary-foreground font-medium text-sm bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        En cours...
                                    </>
                                ) : (
                                    "Confirmer la réception"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}