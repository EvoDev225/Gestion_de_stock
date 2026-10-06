"use client";

import {
    ImageIcon,
    AlertTriangle,
    Pencil,
    Layers,
    Archive,
    ArchiveRestore,
    PackageX,
} from "lucide-react";
import type { Produit } from "@/types/produit";
import Image from "next/image";
import { formaterPrixFCFA } from "@/lib/utils/format-currency";

interface ProductsTableProps {
    produits: Produit[];
    onEdit: (produit: Produit) => void;
    onManageVariants: (produit: Produit) => void;
    onArchiveToggle: (produit: Produit) => void;
    role?: "ADMIN" | "EMPLOYEE";
}

export default function ProductsTable({ produits, onEdit, onManageVariants, onArchiveToggle, role }: ProductsTableProps) {
    const estEmploye = role === "EMPLOYEE";

    const badgeStock = (p: Produit) =>
        p.stockCalcule === 0 ? (
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                Rupture
            </span>
        ) : p.stockCalcule <= p.seuilMinimum ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {p.stockCalcule}
            </span>
        ) : (
            <span className="text-sm text-foreground">{p.stockCalcule}</span>
        );

    const boutonsActions = (p: Produit) => (
        <>
            {!estEmploye && (
                <button type="button" onClick={() => onEdit(p)} title="Éditer"
                    className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
            )}
            <button type="button" onClick={() => onManageVariants(p)} title="Gérer les variantes"
                className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Layers className="h-4 w-4" aria-hidden="true" />
            </button>
            {!estEmploye && (
                <button type="button" onClick={() => onArchiveToggle(p)} title={p.archive ? "Désarchiver" : "Archiver"}
                    className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-destructive">
                    {p.archive ? <ArchiveRestore className="h-4 w-4" aria-hidden="true" /> : <Archive className="h-4 w-4" aria-hidden="true" />}
                </button>
            )}
        </>
    );

    const vide = (
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <PackageX className="h-10 w-10 opacity-50" aria-hidden="true" />
            <span className="text-sm font-medium">Aucun produit trouvé</span>
        </div>
    );

    return (
        <>
            {/* ───────── MOBILE : cartes ───────── */}
            <div className="flex flex-col gap-3 md:hidden">
                {produits.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card">{vide}</div>
                ) : (
                    produits.map((p) => (
                        <div key={p.id} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-start gap-3">
                                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                                    {p.imageUrl ? (
                                        <Image src={p.imageUrl} alt={p.nom} fill className="object-cover" />
                                    ) : (
                                        <ImageIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">{p.nom}</p>
                                    <p className="font-mono text-xs text-muted-foreground">SKU: {p.sku}</p>
                                    <span className="mt-1 inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                                        {p.categorie?.nom ?? "—"}
                                    </span>
                                </div>

                                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    p.archive ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                                }`}>
                                    {p.archive ? "Archivé" : "Actif"}
                                </span>
                            </div>

                            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                <div>
                                    <dt className="text-muted-foreground">Achat</dt>
                                    <dd className="font-medium text-foreground">{formaterPrixFCFA(p.prixAchat)}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Vente</dt>
                                    <dd className="font-semibold text-primary">{formaterPrixFCFA(p.prixVente)}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Stock</dt>
                                    <dd>{badgeStock(p)}</dd>
                                </div>
                            </dl>

                            <div className="mt-3 flex justify-end gap-1 border-t border-border pt-2">
                                {boutonsActions(p)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ───────── DESKTOP / TABLETTE : tableau ───────── */}
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
                <table className="w-full min-w-200 text-left">
                    {/* ton <thead> et ton <tbody> actuels, inchangés */}
                </table>
            </div>
        </>
    );
}