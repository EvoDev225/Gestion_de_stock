"use client";

import { Pencil, Trash2, Truck } from "lucide-react";
import type { Fournisseur } from "@/types/fournisseur";

interface FournisseursTableProps {
    fournisseurs: Fournisseur[];
    onEdit: (fournisseur: Fournisseur) => void;
    onDelete: (fournisseur: Fournisseur) => void;
}

export default function FournisseursTable({
    fournisseurs,
    onEdit,
    onDelete,
}: FournisseursTableProps) {
    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                    <tr>
                        <th className="py-3 px-6">Nom</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">Téléphone</th>
                        <th className="py-3 px-6">Adresse</th>
                        <th className="py-3 px-6">Commandes</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {fournisseurs.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-12 px-6 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-3">
                                    <Truck className="h-10 w-10 opacity-50" aria-hidden="true" />
                                    <span className="text-sm font-medium">Aucun fournisseur trouvé</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        fournisseurs.map((fournisseur) => {
                            const commandes = fournisseur._count?.commandeFournisseurs ?? 0;
                            const cannotDelete = commandes > 0;

                            return (
                                <tr
                                    key={fournisseur.id}
                                    className="border-b border-border transition-colors hover:bg-muted/30"
                                >
                                    <td className="py-3 px-6 font-semibold text-sm text-foreground whitespace-nowrap">
                                        {fournisseur.nom}
                                    </td>

                                    <td className="py-3 px-6 max-w-xs truncate text-sm text-muted-foreground">
                                        {fournisseur.email ?? "—"}
                                    </td>

                                    <td className="py-3 px-6 text-sm text-muted-foreground whitespace-nowrap">
                                        {fournisseur.telephone}
                                    </td>

                                    <td className="py-3 px-6 max-w-md text-sm text-muted-foreground">
                                        <span className="line-clamp-2">{fournisseur.adresse}</span>
                                    </td>

                                    <td className="py-3 px-6 text-sm text-muted-foreground tabular-nums whitespace-nowrap">
                                        {commandes}
                                    </td>

                                    <td className="py-3 px-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(fournisseur)}
                                                aria-label="Modifier"
                                                title="Modifier"
                                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                            >
                                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(fournisseur)}
                                                disabled={cannotDelete}
                                                title={cannotDelete ? "Impossible de supprimer : commandes liées" : "Supprimer"}
                                                aria-label="Supprimer"
                                                className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}