"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Plus, AlertCircle, ShoppingCart } from "lucide-react";
import { Produit } from "@/types/produit";
import LigneVenteFormRow, { LigneVenteDraft } from "./LigneVenteFormRow";

interface NouvelleVenteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVenteCreated: () => void;
}

export default function NouvelleVenteModal({
    isOpen,
    onClose,
    onVenteCreated,
}: NouvelleVenteModalProps) {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [clientNom, setClientNom] = useState<string>("");
    const [clientTelephone, setClientTelephone] = useState<string>("");
    const [modePaiement, setModePaiement] = useState<"TOTAL" | "CREDIT">("TOTAL");
    const [lignes, setLignes] = useState<LigneVenteDraft[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Reset and fetch products when modal opens
    useEffect(() => {
        if (!isOpen) return;

        setClientNom("");
        setClientTelephone("");
        setModePaiement("TOTAL");
        setLignes([]);
        setErrorMessage(null);
        setIsSubmitting(false);

        let isMounted = true;
        fetch("/api/produits")
            .then((res) => res.json())
            .then((data) => {
                if (isMounted) {
                    const list = Array.isArray(data) ? data : data.produits || [];
                    // Keep only unarchived products
                    setProduits(list.filter((p: Produit) => !p.archive));
                }
            })
            .catch(() => {
                if (isMounted) {
                    setProduits([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    const handleAddLigne = () => {
        const nouvelleLigne: LigneVenteDraft = {
            localId: crypto.randomUUID(),
            produitId: "",
            varianteId: null,
            lotId: null,
            quantite: 1,
            prixUnitaire: 0,
            stockInsuffisantConfirme: false,
        };
        setLignes((prev) => [...prev, nouvelleLigne]);
    };

    const handleUpdateLigne = (localId: string, patch: Partial<LigneVenteDraft>) => {
        setLignes((prev) =>
            prev.map((ligne) => (ligne.localId === localId ? { ...ligne, ...patch } : ligne))
        );
    };

    const handleRemoveLigne = (localId: string) => {
        setLignes((prev) => prev.filter((ligne) => ligne.localId !== localId));
    };

    const montantTotal = useMemo(() => {
        return lignes.reduce((acc, l) => acc + (l.quantite || 0) * (l.prixUnitaire || 0), 0);
    }, [lignes]);

    const isFormValide = useMemo(() => {
        if (lignes.length === 0) return false;

        // Check client requirement: either both empty or both filled
        const hasNom = clientNom.trim().length > 0;
        const hasTel = clientTelephone.trim().length > 0;
        if (hasNom !== hasTel) return false;

        // Check every line
        for (const l of lignes) {
            if (!l.produitId || !l.lotId || l.quantite < 1) {
                return false;
            }
        }

        return true;
    }, [lignes, clientNom, clientTelephone]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValide || isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const payload = {
                modePaiement,
                ...(clientNom.trim() && clientTelephone.trim()
                    ? { client: { nom: clientNom.trim(), telephone: clientTelephone.trim() } }
                    : {}),
                lignes: lignes.map((l) => ({
                    produitId: l.produitId,
                    varianteId: l.varianteId || undefined,
                    lotId: l.lotId,
                    quantite: l.quantite,
                    prixUnitaire: l.prixUnitaire,
                    stockInsuffisantConfirme: l.stockInsuffisantConfirme,
                })),
            };

            const res = await fetch("/api/ventes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Erreur lors de la création de la vente.");
            }

            onVenteCreated();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Une erreur est survenue.";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (montant: number) => {
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(montant);
    };

    if (!isOpen) return null;

    return (
        <div
        className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
    >
            <div
            className="w-full max-w-3xl bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
        >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground">Nouvelle vente</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body scrollable */}
                <form id="vente-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Error message */}
                    {errorMessage && (
                        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Section Client Optionnelle */}
                    <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">Informations client (Optionnel)</span>
                            <span className="text-xs text-muted-foreground">Laissez vide pour une vente anonyme</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-muted-foreground">Nom du client</label>
                                <input
                                    type="text"
                                    value={clientNom}
                                    onChange={(e) => setClientNom(e.target.value)}
                                    placeholder="Ex: Jean Kouassi"
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-xs font-medium text-muted-foreground">Téléphone</label>
                                <input
                                    type="text"
                                    value={clientTelephone}
                                    onChange={(e) => setClientTelephone(e.target.value)}
                                    placeholder="Ex: +225 0700000000"
                                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>
                        {clientNom.trim() !== clientTelephone.trim() && (
                            (!clientNom.trim() || !clientTelephone.trim()) && (
                                <p className="text-xs text-warning">
                                    Attention : si vous remplissez le nom ou le téléphone, les deux champs doivent être renseignés.
                                </p>
                            )
                        )}
                    </div>

                    {/* Mode de paiement */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Mode de paiement</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setModePaiement("TOTAL")}
                                className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${modePaiement === "TOTAL"
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-border hover:bg-muted/50"
                                    }`}
                            >
                                Total (Comptant)
                            </button>
                            <button
                                type="button"
                                onClick={() => setModePaiement("CREDIT")}
                                className={`flex-1 py-2 px-4 rounded-md border text-sm font-medium transition-colors ${modePaiement === "CREDIT"
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background text-foreground border-border hover:bg-muted/50"
                                    }`}
                            >
                                Crédit
                            </button>
                        </div>
                    </div>

                    {/* Liste des lignes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-foreground">Lignes de vente</h3>
                            <button
                                type="button"
                                onClick={handleAddLigne}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border bg-background text-foreground hover:bg-muted/50 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter une ligne
                            </button>
                        </div>

                        {lignes.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-border rounded-lg text-muted-foreground text-sm">
                                Aucune ligne ajoutée. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {lignes.map((ligne) => (
                                    <LigneVenteFormRow
                                        key={ligne.localId}
                                        ligne={ligne}
                                        produits={produits}
                                        onChange={(patch) => handleUpdateLigne(ligne.localId, patch)}
                                        onRemove={() => handleRemoveLigne(ligne.localId)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer sticky */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card">
                    <div className="text-sm font-medium text-muted-foreground">
                        Total : <span className="text-foreground text-base font-bold">{formatCurrency(montantTotal)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            form="vente-form"
                            disabled={isSubmitting || !isFormValide}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Enregistrement..." : "Enregistrer la vente"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}