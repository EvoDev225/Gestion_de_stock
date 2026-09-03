"use client";

import { Mail, MapPin, Pencil, Phone, Trash2 } from "lucide-react";
import type { Fournisseur } from "@/types/fournisseur";

interface FournisseurCardProps {
    fournisseur: Fournisseur;
    onEdit: (fournisseur: Fournisseur) => void;
    onDelete: (fournisseur: Fournisseur) => void;
}

export default function FournisseurCard({
    fournisseur,
    onEdit,
    onDelete,
}: FournisseurCardProps) {
    const commandesCount = fournisseur._count?.commandeFournisseurs ?? 0;
    const cannotDelete = commandesCount > 0;

    return (
        <div className="flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {fournisseur.nom}
                    </h3>

                    {commandesCount > 0 && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {commandesCount} commande{commandesCount > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                    {fournisseur.email && (
                        <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                            <span className="truncate">{fournisseur.email}</span>
                        </p>
                    )}

                    <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                        <span className="truncate">{fournisseur.telephone}</span>
                    </p>

                    <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <span className="line-clamp-2">{fournisseur.adresse}</span>
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
                <button
                    type="button"
                    onClick={() => onEdit(fournisseur)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                    <Pencil className="h-4 w-4" />
                    Modifier
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
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${cannotDelete
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 opacity-60"
                            : "border-red-200 bg-white text-red-600 hover:bg-red-50"
                        }`}
                >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                </button>
            </div>
        </div>
    );
}