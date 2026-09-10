"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Produit, Variante } from "@/types/produit";

export interface LigneVenteDraft {
    localId: string; // identifiant local pour la key React, jamais envoyé au backend
    produitId: string;
    varianteId: string | null;
    lotId: string | null;
    quantite: number;
    prixUnitaire: number;
    stockInsuffisantConfirme: boolean;
}
interface LotDisponible {
    id: string;
    numeroLot: string;
    quantite: number;
    dateExpiration: string | null;
}
interface LigneVenteFormRowProps {
    ligne: LigneVenteDraft;
    produits: Produit[];
    onChange: (patch: Partial<LigneVenteDraft>) => void;
    onRemove: () => void;
}

export default function LigneVenteFormRow({
    ligne,
    produits,
    onChange,
    onRemove,
}: LigneVenteFormRowProps) {
    const [variantes, setVariantes] = useState<Variante[]>([]);

    const [isLoadingVariantes, setIsLoadingVariantes] = useState<boolean>(false);

    const [lots, setLots] = useState<LotDisponible[]>([]);
    const [isLoadingLots, setIsLoadingLots] = useState<boolean>(false);

    // Fetch variantes when produitId changes
    useEffect(() => {
        if (!ligne.produitId) {
            setVariantes([]);
            return;
        }

        let isMounted = true;
        setIsLoadingVariantes(true);

        fetch(`/api/variantes?produitId=${ligne.produitId}`)
            .then((res) => res.json())
            .then((data) => {
                if (isMounted) {
                    setVariantes(Array.isArray(data) ? data : data.variantes || []);
                    setIsLoadingVariantes(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setVariantes([]);
                    setIsLoadingVariantes(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [ligne.produitId]);

    // Fetch lots based on produitId or varianteId
    useEffect(() => {
        const hasVariantes = variantes.length > 0;
        if (!ligne.produitId || (hasVariantes && !ligne.varianteId)) {
            setLots([]);
            return;
        }

        let isMounted = true;
        setIsLoadingLots(true);

        const url = hasVariantes
            ? `/api/lots?varianteId=${ligne.varianteId}`
            : `/api/lots?produitId=${ligne.produitId}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                if (isMounted) {
                    setLots(Array.isArray(data) ? data : data.lots || []);
                    setIsLoadingLots(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setLots([]);
                    setIsLoadingLots(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [ligne.produitId, ligne.varianteId, variantes]);

    // Find currently selected lot
    const selectedLot = lots.find((l) => l.id === ligne.lotId);

    // Stock warning check and auto-reset confirmation
    const isStockInsufficient = selectedLot && ligne.quantite > selectedLot.quantite;

    useEffect(() => {
        if ((!isStockInsufficient || !selectedLot) && ligne.stockInsuffisantConfirme) {
            onChange({ stockInsuffisantConfirme: false });
        }
    }, [isStockInsufficient, selectedLot, ligne.stockInsuffisantConfirme, onChange]);

    const handleProduitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nouvelId = e.target.value;
        const produitCorrespondant = produits.find((p) => p.id === nouvelId);
        const nouveauPrix = produitCorrespondant ? parseFloat(String(produitCorrespondant.prixVente)) || 0 : 0;

        onChange({
            produitId: nouvelId,
            varianteId: null,
            lotId: null,
            stockInsuffisantConfirme: false,
            prixUnitaire: nouveauPrix,
        });
    };

    const handleVarianteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nouvelleValeur = e.target.value || null;
        onChange({
            varianteId: nouvelleValeur,
            lotId: null,
            stockInsuffisantConfirme: false,
        });
    };

    const handleLotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nouvelleValeur = e.target.value || null;
        onChange({ lotId: nouvelleValeur });
    };

    const handleQuantiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        onChange({ quantite: isNaN(val) || val < 1 ? 1 : val });
    };

    const formatCurrency = (montant: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(montant);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Pas de péremption";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Pas de péremption";
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return `Exp. ${date.toLocaleDateString('fr-FR', options)}`;
    };

    const sousTotal = (ligne.quantite || 0) * (ligne.prixUnitaire || 0);

    return (
        <div className="bg-card border border-border rounded-lg p-4 relative space-y-4">
            {/* Delete button top right */}
            <div className="absolute top-4 right-4">
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted/50"
                    aria-label="Supprimer la ligne"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-10">
                {/* Select Produit */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted-foreground">
                        Produit
                    </label>
                    <select
                        value={ligne.produitId}
                        onChange={handleProduitChange}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="">Sélectionner un produit</option>
                        {produits.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nom} ({p.sku})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Variante (if applicable) */}
                {variantes.length > 0 && (
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-muted-foreground">
                            Variante
                        </label>
                        <select
                            value={ligne.varianteId || ""}
                            onChange={handleVarianteChange}
                            disabled={isLoadingVariantes}
                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                        >
                            <option value="">Sélectionner une variante</option>
                            {variantes.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.nomVariante}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Select Lot */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted-foreground">
                        Lot
                    </label>
                    <select
                        value={ligne.lotId || ""}
                        onChange={handleLotChange}
                        disabled={
                            !ligne.produitId ||
                            isLoadingLots ||
                            (variantes.length > 0 && !ligne.varianteId)
                        }
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    >
                        <option value="">
                            {!ligne.produitId || (variantes.length > 0 && !ligne.varianteId)
                                ? "Sélectionnez d'abord un produit"
                                : isLoadingLots
                                ? "Chargement des lots..."
                                : "Sélectionner un lot"}
                        </option>
                        {lots.map((lot) => {
                            const isEpuise = lot.quantite <= 0;
                            return (
                                <option key={lot.id} value={lot.id}>
                                    {lot.numeroLot} - Dispo: {lot.quantite} - {formatDate(lot.dateExpiration)}
                                    {isEpuise ? " (stock épuisé)" : ""}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Input Quantité */}
                <div className="space-y-1">
                    <label className="block text-xs font-medium text-muted-foreground">
                        Quantité
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={ligne.quantite}
                        onChange={handleQuantiteChange}
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Option details or indicator if lot is depleted but selectable */}
            {selectedLot && selectedLot.quantite <= 0 && (
                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Ce lot est actuellement en stock épuisé (quantité : 0), mais reste sélectionnable.</span>
                </div>
            )}

            {/* Avertissement de stock insuffisant */}
            {isStockInsufficient && selectedLot && (
                <div className="bg-warning/10 text-warning p-3 rounded-md space-y-2 border border-warning/20">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>
                            Stock insuffisant sur ce lot (disponible : {selectedLot.quantite}). La vente reste possible avec confirmation.
                        </span>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer pt-1">
                        <input
                            type="checkbox"
                            checked={ligne.stockInsuffisantConfirme}
                            onChange={(e) => onChange({ stockInsuffisantConfirme: e.target.checked })}
                            className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span>Je confirme vouloir vendre malgré le stock insuffisant</span>
                    </label>
                </div>
            )}

            {/* Prix unitaire & Sous-total */}
            <div className="flex flex-wrap items-center justify-between text-sm pt-2 border-t border-border gap-4">
                <div className="text-muted-foreground">
                    Prix unitaire : <span className="text-foreground font-medium">{formatCurrency(ligne.prixUnitaire)}</span>
                </div>
                <div className="text-muted-foreground font-semibold">
                    Sous-total : <span className="text-primary font-bold">{formatCurrency(sousTotal)}</span>
                </div>
            </div>
        </div>
    );
}