"use client";

import { useState } from "react";
import { X, Layers, Pencil, Trash2 } from "lucide-react";
import type { Produit, Variante } from "@/types/produit";

interface VariantsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    produit: Produit | null;
    variantes: Variante[];
    onAddVariant: (data: { nomVariante: string; skuVariante: string }) => Promise<void>;
    onDeleteVariant: (varianteId: string) => Promise<void>;
    onEditVariant: (varianteId: string, data: { nomVariante: string; skuVariante: string }) => Promise<void>;
}

export default function VariantsPanel({
    isOpen,
    onClose,
    produit,
    variantes,
    onAddVariant,
    onDeleteVariant,
    onEditVariant,
}: VariantsPanelProps) {
    const [newNom, setNewNom] = useState("");
    const [newSku, setNewSku] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNom, setEditNom] = useState("");
    const [editSku, setEditSku] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    if (!isOpen || !produit) return null;

    const handleAdd = async () => {
        if (!newNom.trim() || !newSku.trim()) return;
        setIsAdding(true);
        try {
            await onAddVariant({ nomVariante: newNom.trim(), skuVariante: newSku.trim() });
            setNewNom("");
            setNewSku("");
        } finally {
            setIsAdding(false);
        }
        // Note: onClose n'est pas appelé ici pour permettre l'ajout multiple, 
        // l'utilisateur ferme manuellement le panneau quand il a terminé.
    };

    const startEdit = (variante: Variante) => {
        setEditingId(variante.id);
        setEditNom(variante.nomVariante);
        setEditSku(variante.skuVariante);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditNom("");
        setEditSku("");
    };

    const saveEdit = async () => {
        if (!editingId || !editNom.trim() || !editSku.trim()) return;
        setIsEditing(true);
        try {
            await onEditVariant(editingId, { nomVariante: editNom.trim(), skuVariante: editSku.trim() });
            setEditingId(null);
        } finally {
            setIsEditing(false);
        }
    };

    const handleDelete = async (varianteId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette variante ?")) {
            await onDeleteVariant(varianteId);
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
                        Variantes de {produit.nom}
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

                {/* ── Corps ── */}
                <div className="flex-1 overflow-y-auto p-6">
                    {variantes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-muted-foreground">
                            <Layers className="h-12 w-12 opacity-50" aria-hidden="true" />
                            <p className="text-sm font-medium">Aucune variante pour ce produit</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {variantes.map((variante) => (
                                <div
                                    key={variante.id}
                                    className="border border-border rounded-lg p-3 flex items-center justify-between gap-4"
                                >
                                    {editingId === variante.id ? (
                                        /* Mode édition inline */
                                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                                            <input
                                                type="text"
                                                value={editNom}
                                                onChange={(e) => setEditNom(e.target.value)}
                                                placeholder="Nom"
                                                className="flex-1 rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <input
                                                type="text"
                                                value={editSku}
                                                onChange={(e) => setEditSku(e.target.value.toUpperCase())}
                                                placeholder="SKU"
                                                className="flex-1 rounded-md border border-border bg-card px-2 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={saveEdit}
                                                    disabled={isEditing}
                                                    className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
                                                >
                                                    Valider
                                                </button>
                                                <input
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    disabled={isEditing}
                                                    className="px-3 py-1.5 text-xs font-medium border border-border text-foreground rounded-md hover:bg-muted disabled:opacity-50"
                                                >
                                                    Annuler
                                                </input>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Mode affichage */
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm text-foreground truncate">
                                                    {variante.nomVariante}
                                                </div>
                                                <div className="text-xs font-mono text-muted-foreground">
                                                    SKU: {variante.skuVariante}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Stock: {(variante as any).stockCalcule ?? 0} (calculé depuis les lots)
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(variante)}
                                                    className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                                    aria-label="Modifier la variante"
                                                >
                                                    <Pencil className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(variante.id)}
                                                    className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                                                    aria-label="Supprimer la variante"
                                                >
                                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer (Formulaire d'ajout) ── */}
                <div className="border-t border-border p-4 shrink-0 bg-muted/30">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Nom de la variante"
                            value={newNom}
                            onChange={(e) => setNewNom(e.target.value)}
                            className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <input
                            type="text"
                            placeholder="SKU variante"
                            value={newSku}
                            onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                            className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!newNom.trim() || !newSku.trim() || isAdding}
                            className="shrink-0 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {isAdding ? "Ajout..." : "Ajouter"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}