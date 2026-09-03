"use client";

import { Pencil, Trash2 } from "lucide-react";
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
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="sticky top-0 z-10 whitespace-nowrap bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Nom
                        </th>
                        <th className="sticky top-0 z-10 whitespace-nowrap bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Email
                        </th>
                        <th className="sticky top-0 z-10 whitespace-nowrap bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Téléphone
                        </th>
                        <th className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Adresse
                        </th>
                        <th className="sticky top-0 z-10 whitespace-nowrap bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Commandes
                        </th>
                        <th className="sticky top-0 z-10 whitespace-nowrap bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {fournisseurs.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-6 py-12 text-center text-sm text-gray-500"
                            >
                                Aucun fournisseur trouvé
                            </td>
                        </tr>
                    ) : (
                        fournisseurs.map((fournisseur) => {
                            const commandes = fournisseur._count?.commandeFournisseurs ?? 0;
                            const cannotDelete = commandes > 0;

                            return (
                                <tr key={fournisseur.id} className="transition-colors hover:bg-muted/50">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                        {fournisseur.nom}
                                    </td>

                                    <td className="max-w-xs truncate px-6 py-4 text-gray-600">
                                        {fournisseur.email ?? "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                                        {fournisseur.telephone}
                                    </td>

                                    <td className="max-w-md px-6 py-4 text-gray-600">
                                        <span className="line-clamp-2">{fournisseur.adresse}</span>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 tabular-nums text-gray-600">
                                        {commandes}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => onEdit(fournisseur)}
                                                aria-label="Modifier"
                                                className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onDelete(fournisseur)}
                                                disabled={cannotDelete}
                                                title={
                                                    cannotDelete
                                                        ? "Impossible de supprimer : commandes liées"
                                                        : undefined
                                                }
                                                aria-label="Supprimer"
                                                className={`rounded-md p-2 transition-colors ${cannotDelete
                                                        ? "cursor-not-allowed text-gray-300 opacity-50"
                                                        : "text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    }`}
                                            >
                                                <Trash2 className="h-4 w-4" />
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