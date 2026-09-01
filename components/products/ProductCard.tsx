"use client";

import { useState, useRef, useEffect } from "react";
import {
    ImageIcon,
    MoreVertical,
    Pencil,
    Layers,
    Archive,
    AlertTriangle,
} from "lucide-react";
import type { Produit } from "@/types/produit";

interface ProductCardProps {
    produit: Produit;
    onEdit: (produit: Produit) => void;
    onManageVariants: (produit: Produit) => void;
    onArchiveToggle: (produit: Produit) => void;
}

export default function ProductCard({
    produit,
    onEdit,
    onManageVariants,
    onArchiveToggle,
}: ProductCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fermer le menu au clic extérieur
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            {/* ── Ligne du haut : Image, Infos, Menu ── */}
            <div className="flex gap-3 items-start">
                {/* Image */}
                <div className="w-12 h-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
                    {produit.imageUrl ? (
                        <img
                            src={produit.imageUrl}
                            alt={produit.nom}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                    )}
                </div>

                {/* Bloc texte */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <span className="font-semibold text-sm text-foreground truncate">
                        {produit.nom}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                        SKU: {produit.sku}
                    </span>
                    <span className="inline-flex w-fit items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {produit.categorie?.nom ?? "—"}
                    </span>
                </div>

                {/* Menu actions */}
                <div className="relative shrink-0" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Options du produit"
                        aria-expanded={isMenuOpen}
                    >
                        <MoreVertical className="h-4 w-4" aria-hidden="true" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card z-50 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => {
                                    onEdit(produit);
                                    setIsMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                            >
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                Éditer
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onManageVariants(produit);
                                    setIsMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                            >
                                <Layers className="h-4 w-4" aria-hidden="true" />
                                Gérer les variantes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onArchiveToggle(produit);
                                    setIsMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-destructive"
                            >
                                <Archive className="h-4 w-4" aria-hidden="true" />
                                {produit.archive ? "Désarchiver" : "Archiver"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Ligne du bas : Prix, Stock, Statut ── */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-semibold text-primary">
                    {produit.prixVente} €
                </span>

                <div className="flex items-center gap-2">
                    {/* Badge Stock */}
                    {produit.quantiteStock === 0 ? (
                        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                            Rupture
                        </span>
                    ) : produit.quantiteStock <= produit.seuilMinimum ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600">
                            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                            {produit.quantiteStock}
                        </span>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            {produit.quantiteStock}
                        </span>
                    )}

                    {/* Badge Statut */}
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${!produit.archive
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${!produit.archive ? "bg-primary" : "bg-muted-foreground"
                                }`}
                        />
                        {!produit.archive ? "Actif" : "Archivé"}
                    </span>
                </div>
            </div>
        </div>
    );
}