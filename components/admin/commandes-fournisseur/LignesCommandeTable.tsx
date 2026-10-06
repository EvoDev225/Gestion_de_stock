"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, Loader2, ClipboardList } from "lucide-react";
import type { LigneCommandeFournisseur } from "@/types/commande-fournisseur";

function formatMontant(montant: number): string {
    return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
}

interface LigneProps {
    ligne: LigneCommandeFournisseur;
    modifiable: boolean;
    isSaving: boolean;
    canDelete: boolean;
    onModifier: (ligneId: string, data: { quantiteCommande?: number; prixAchatUnitaire?: number }) => Promise<void>;
    onSupprimer: (ligneId: string) => void;
}

// ── Ligne de tableau (desktop) ──
function LigneRow({ ligne, modifiable, isSaving, canDelete, onModifier, onSupprimer }: LigneProps) {
    const [localQty, setLocalQty] = useState(ligne.quantiteCommande);
    const [localPrice, setLocalPrice] = useState(ligne.prixAchatUnitaire);

    // ✅ NOUVEAU : Synchronisation pendant le rendu (sans useEffect)
    const [prevQty, setPrevQty] = useState(ligne.quantiteCommande);
    const [prevPrice, setPrevPrice] = useState(ligne.prixAchatUnitaire);

    if (ligne.quantiteCommande !== prevQty) {
        setPrevQty(ligne.quantiteCommande);
        setLocalQty(ligne.quantiteCommande);
    }
    if (ligne.prixAchatUnitaire !== prevPrice) {
        setPrevPrice(ligne.prixAchatUnitaire);
        setLocalPrice(ligne.prixAchatUnitaire);
    }
    // ❌ SUPPRIME LE useEffect QUI ÉTAIT ICI

    const isDirty = localQty !== ligne.quantiteCommande || localPrice !== ligne.prixAchatUnitaire;
    const subtotal = Number(localQty) * Number(localPrice);

    const handleSave = async () => {
        if (!isDirty) return;
        await onModifier(ligne.id, {
            quantiteCommande: Number(localQty),
            prixAchatUnitaire: Number(localPrice),
        });
    };

    return (
        <tr className={`border-b border-border ${isSaving ? "bg-muted/30 opacity-70" : "hover:bg-muted/30"}`}>
            <td className="py-3 px-6">
                <div className="text-sm font-medium text-foreground">{ligne.produit.nom}</div>
                <div className="font-mono text-xs text-muted-foreground">{ligne.produit.sku}</div>
            </td>
            <td className="py-3 px-6">
                {modifiable ? (
                    <input
                        type="number"
                        min={1}
                        value={localQty}
                        onChange={(e) => setLocalQty(Number(e.target.value))}
                        disabled={isSaving}
                        className="w-24 rounded-lg border border-border bg-background text-foreground text-sm p-1.5 focus:border-primary disabled:opacity-50"
                    />
                ) : (
                    <span className="text-sm font-medium text-foreground">{ligne.quantiteCommande}</span>
                )}
            </td>
            <td className="py-3 px-6">
                {modifiable ? (
                    <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={localPrice}
                        onChange={(e) => setLocalPrice(Number(e.target.value))}
                        disabled={isSaving}
                        className="w-32 rounded-lg border border-border bg-background text-foreground text-sm p-1.5 focus:border-primary disabled:opacity-50"
                    />
                ) : (
                    <span className="text-sm font-medium text-foreground">{formatMontant(ligne.prixAchatUnitaire)}</span>
                )}
            </td>
            <td className="py-3 px-6 text-sm font-semibold text-foreground">{formatMontant(subtotal)}</td>
            <td className="py-3 px-6 text-right">
                {modifiable && (
                    <div className="flex items-center justify-end gap-1">
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                        ) : (
                            <>
                                {isDirty && (
                                    <button
                                        onClick={handleSave}
                                        title="Valider les modifications"
                                        className="rounded p-1.5 text-primary transition-colors hover:bg-primary/10"
                                    >
                                        <Check className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                )}
                                <button
                                    onClick={() => onSupprimer(ligne.id)}
                                    disabled={!canDelete}
                                    title={!canDelete ? "Impossible de supprimer la dernière ligne" : "Supprimer la ligne"}
                                    className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
}

// ── Carte (mobile) ──
function LigneCard({ ligne, modifiable, isSaving, canDelete, onModifier, onSupprimer }: LigneProps) {
    const [localQty, setLocalQty] = useState(ligne.quantiteCommande);
    const [localPrice, setLocalPrice] = useState(ligne.prixAchatUnitaire);

    // ✅ NOUVEAU : Synchronisation pendant le rendu (sans useEffect)
    const [prevQty, setPrevQty] = useState(ligne.quantiteCommande);
    const [prevPrice, setPrevPrice] = useState(ligne.prixAchatUnitaire);

    if (ligne.quantiteCommande !== prevQty) {
        setPrevQty(ligne.quantiteCommande);
        setLocalQty(ligne.quantiteCommande);
    }
    if (ligne.prixAchatUnitaire !== prevPrice) {
        setPrevPrice(ligne.prixAchatUnitaire);
        setLocalPrice(ligne.prixAchatUnitaire);
    }
    // ❌ SUPPRIME LE useEffect QUI ÉTAIT ICI

    const isDirty = localQty !== ligne.quantiteCommande || localPrice !== ligne.prixAchatUnitaire;
    const subtotal = Number(localQty) * Number(localPrice);

    const handleSave = async () => {
        if (!isDirty) return;
        await onModifier(ligne.id, {
            quantiteCommande: Number(localQty),
            prixAchatUnitaire: Number(localPrice),
        });
    };

    return (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ligne.produit.nom}</p>
                    <p className="font-mono text-xs text-muted-foreground">{ligne.produit.sku}</p>
                </div>
                <span className="text-sm font-semibold text-primary shrink-0">{formatMontant(subtotal)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Quantité</p>
                    {modifiable ? (
                        <input
                            type="number"
                            min={1}
                            value={localQty}
                            onChange={(e) => setLocalQty(Number(e.target.value))}
                            disabled={isSaving}
                            className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary disabled:opacity-50"
                        />
                    ) : (
                        <p className="text-sm font-medium text-foreground">{ligne.quantiteCommande}</p>
                    )}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Prix unitaire</p>
                    {modifiable ? (
                        <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={localPrice}
                            onChange={(e) => setLocalPrice(Number(e.target.value))}
                            disabled={isSaving}
                            className="w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary disabled:opacity-50"
                        />
                    ) : (
                        <p className="text-sm font-medium text-foreground">{formatMontant(ligne.prixAchatUnitaire)}</p>
                    )}
                </div>
            </div>

            {modifiable && (
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
                    ) : (
                        <>
                            {isDirty && (
                                <button
                                    onClick={handleSave}
                                    title="Valider les modifications"
                                    className="rounded p-2 text-primary hover:bg-primary/10"
                                >
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                </button>
                            )}
                            <button
                                onClick={() => onSupprimer(ligne.id)}
                                disabled={!canDelete}
                                title={!canDelete ? "Impossible de supprimer la dernière ligne" : "Supprimer la ligne"}
                                className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Composant principal ──
interface LignesCommandeTableProps {
    lignes: LigneCommandeFournisseur[];
    modifiable: boolean;
    onModifierLigne: (ligneId: string, data: { quantiteCommande?: number; prixAchatUnitaire?: number }) => Promise<void>;
    onSupprimerLigne: (ligneId: string) => void;
    isModifiantLigneId: string | null;
}

export default function LignesCommandeTable({
    lignes,
    modifiable,
    onModifierLigne,
    onSupprimerLigne,
    isModifiantLigneId,
}: LignesCommandeTableProps) {
    const total = lignes.reduce((sum, l) => sum + Number(l.quantiteCommande) * Number(l.prixAchatUnitaire), 0);
    const canDelete = lignes.length > 1;

    if (lignes.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card py-12 px-6 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                    <ClipboardList className="h-10 w-10 opacity-50" aria-hidden="true" />
                    <span className="text-sm font-medium">Aucune ligne dans cette commande</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ✅ TABLEAU — desktop */}
            <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                        <tr>
                            <th className="py-3 px-6">Produit</th>
                            <th className="py-3 px-6">Quantité</th>
                            <th className="py-3 px-6">Prix unitaire</th>
                            <th className="py-3 px-6">Sous-total</th>
                            <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lignes.map((ligne) => (
                            <LigneRow
                                key={ligne.id}
                                ligne={ligne}
                                modifiable={modifiable}
                                isSaving={isModifiantLigneId === ligne.id}
                                canDelete={canDelete}
                                onModifier={onModifierLigne}
                                onSupprimer={onSupprimerLigne}
                            />
                        ))}
                    </tbody>
                    <tfoot className="bg-muted/50 border-t border-border">
                        <tr>
                            <td colSpan={3} className="py-4 px-6 text-right text-sm font-bold text-foreground uppercase">
                                Total commande
                            </td>
                            <td className="py-4 px-6 text-sm font-bold text-primary">{formatMontant(total)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* ✅ CARTES — mobile */}
            <div className="md:hidden flex flex-col gap-3">
                {lignes.map((ligne) => (
                    <LigneCard
                        key={ligne.id}
                        ligne={ligne}
                        modifiable={modifiable}
                        isSaving={isModifiantLigneId === ligne.id}
                        canDelete={canDelete}
                        onModifier={onModifierLigne}
                        onSupprimer={onSupprimerLigne}
                    />
                ))}
                <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground uppercase">Total commande</span>
                    <span className="text-sm font-bold text-primary">{formatMontant(total)}</span>
                </div>
            </div>
        </>
    );
}