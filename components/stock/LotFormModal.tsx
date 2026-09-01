"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Lot } from "@/types/lot";
import type { Produit } from "@/types/produit";
import type { Variante } from "@/types/produit";

interface LotFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    lot: Lot | null;
    produits: Produit[];
    onSubmit: (data: {
        numeroLot: string;
        quantite: number;
        dateReception: string;
        dateExpiration: string;
        produitId: string | null;
        varianteId: string | null;
    }) => Promise<void>;
}

export default function LotFormModal({
    isOpen,
    onClose,
    lot,
    produits,
    onSubmit,
}: LotFormModalProps) {
    // Initialisation directe depuis `lot` (le parent doit passer une `key` pour forcer le remount)
    const [numeroLot, setNumeroLot] = useState(lot?.numeroLot ?? "");
    const [produitId, setProduitId] = useState<string | null>(
        lot?.produitId ?? lot?.produit?.id ?? null
    );
    const [varianteId, setVarianteId] = useState<string | null>(
        lot?.varianteId ?? lot?.variante?.id ?? null
    );
    const [quantite, setQuantite] = useState<number>(lot?.quantite ?? 0);
    const [dateReception, setDateReception] = useState<string>(lot?.dateReception ?? "");
    const [dateExpiration, setDateExpiration] = useState<string>(lot?.dateExpiration ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Variantes du produit sélectionné — chargées à part, car GET /api/produits
    // ne renvoie pas les variantes imbriquées (voir /api/variantes?produitId=xxx)
    const [variants, setVariants] = useState<Variante[]>([]);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);

    useEffect(() => {
        if (!produitId) {
            setVariants([]);
            return;
        }
        let cancelled = false;
        setIsLoadingVariants(true);
        fetch(`/api/variantes?produitId=${produitId}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data: Variante[]) => {
                if (!cancelled) setVariants(data);
            })
            .catch(() => {
                if (!cancelled) setVariants([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoadingVariants(false);
            });
        return () => {
            cancelled = true;
        };
    }, [produitId]);

    if (!isOpen) return null;

    const hasVariants = variants.length > 0;

    const handleProduitChange = (id: string) => {
        setProduitId(id || null);
        setVarianteId(null); // Réinitialise la variante lors du changement de produit
    };

    const handleSubmit = async () => {
        if (!produitId || !numeroLot.trim()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                numeroLot: numeroLot.trim(),
                quantite,
                dateReception,
                dateExpiration,
                produitId,
                varianteId,
            });
            onClose();
        } catch (error) {
            console.error("Erreur lors de la soumission du lot :", error);
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
                className="w-full max-w-lg bg-card h-full shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">
                        {lot ? "Modifier le lot" : "Nouveau lot"}
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

                {/* ── Corps scrollable ── */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col gap-6">
                        {/* Numéro de lot */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="numeroLot" className="text-sm font-medium text-foreground">
                                Numéro de lot
                            </label>
                            <input
                                id="numeroLot"
                                type="text"
                                value={numeroLot}
                                onChange={(e) => setNumeroLot(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>

                        {/* Produit */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="produit" className="text-sm font-medium text-foreground">
                                Produit
                            </label>
                            <select
                                id="produit"
                                value={produitId || ""}
                                onChange={(e) => handleProduitChange(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            >
                                <option value="">Sélectionner un produit</option>
                                {produits.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Variante (conditionnel) */}
                        {produitId && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="variante" className="text-sm font-medium text-foreground">
                                    Variante (optionnel)
                                </label>
                                <select
                                    id="variante"
                                    value={varianteId || ""}
                                    onChange={(e) => setVarianteId(e.target.value || null)}
                                    disabled={isLoadingVariants || !hasVariants}
                                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                                >
                                    <option value="">Aucune (produit seul)</option>
                                    {variants.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.nomVariante}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingVariants && (
                                    <span className="text-xs text-muted-foreground">Chargement des variantes...</span>
                                )}
                                {!isLoadingVariants && !hasVariants && (
                                    <span className="text-xs text-muted-foreground">Ce produit n'a pas de variantes</span>
                                )}
                            </div>
                        )}

                        {/* Quantité */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="quantite" className="text-sm font-medium text-foreground">
                                Quantité
                            </label>
                            <input
                                id="quantite"
                                type="number"
                                min="0"
                                value={quantite}
                                onChange={(e) => setQuantite(Number(e.target.value))}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>

                        {/* Date de réception */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="dateReception" className="text-sm font-medium text-foreground">
                                Date de réception
                            </label>
                            <input
                                id="dateReception"
                                type="date"
                                value={dateReception}
                                onChange={(e) => setDateReception(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>

                        {/* Date d'expiration */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="dateExpiration" className="text-sm font-medium text-foreground">
                                Date d'expiration
                            </label>
                            <input
                                id="dateExpiration"
                                type="date"
                                value={dateExpiration}
                                onChange={(e) => setDateExpiration(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
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
                        disabled={isSubmitting || !produitId || !numeroLot.trim()}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}