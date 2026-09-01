"use client";

import {
    ImageIcon,
    AlertTriangle,
    Pencil,
    Layers,
    Archive,
    PackageX,
} from "lucide-react";
import type { Produit } from "@/types/produit";
import Image from "next/image";

interface ProductsTableProps {
    produits: Produit[];
    onEdit: (produit: Produit) => void;
    onManageVariants: (produit: Produit) => void;
    onArchiveToggle: (produit: Produit) => void;
}

export default function ProductsTable({
    produits,
    onEdit,
    onManageVariants,
    onArchiveToggle,
}: ProductsTableProps) {
    return (
        <div className="hidden lg:block rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th className="py-3 px-6">Image</th>
                        <th className="py-3 px-6">Nom & SKU</th>
                        <th className="py-3 px-6">Catégorie</th>
                        <th className="py-3 px-6">Prix d'achat</th>
                        <th className="py-3 px-6">Prix de vente</th>
                        <th className="py-3 px-6">Stock</th>
                        <th className="py-3 px-6">Statut</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="py-12 px-6 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <PackageX className="h-10 w-10 opacity-50" aria-hidden="true" />
                                    <span className="text-sm font-medium">Aucun produit trouvé</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        produits.map((produit) => (
                            <tr
                                key={produit.id}
                                className="border-b border-border transition-colors hover:bg-muted/30"
                            >
                                {/* Image */}
                                <td className="py-3 px-6">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                                        {produit.imageUrl ? (
                                            <Image
                                                src={produit.imageUrl}
                                                alt={produit.nom}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                        )}
                                    </div>
                                </td>

                                {/* Nom & SKU */}
                                <td className="py-3 px-6">
                                    <div className="font-semibold text-sm text-foreground">
                                        {produit.nom}
                                    </div>
                                    <div className="font-mono text-xs text-muted-foreground">
                                        SKU: {produit.sku}
                                    </div>
                                </td>

                                {/* Catégorie */}
                                <td className="py-3 px-6">
                                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                        {produit.categorie?.nom ?? "—"}
                                    </span>
                                </td>

                                {/* Prix d'achat */}
                                <td className="py-3 px-6 text-sm text-muted-foreground">
                                    {produit.prixAchat} €
                                </td>

                                {/* Prix de vente */}
                                <td className="py-3 px-6 text-sm font-semibold text-primary">
                                    {produit.prixVente} €
                                </td>

                                {/* Stock */}
                                <td className="py-3 px-6">
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
                                </td>

                                {/* Statut */}
                                <td className="py-3 px-6">
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
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-6">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(produit)}
                                            title="Éditer"
                                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            <Pencil className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onManageVariants(produit)}
                                            title="Gérer les variantes"
                                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            <Layers className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onArchiveToggle(produit)}
                                            title={produit.archive ? "Désarchiver" : "Archiver"}
                                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                                        >
                                            <Archive className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}