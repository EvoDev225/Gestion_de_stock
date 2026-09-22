"use client";

import { Pencil, Trash2, Tag } from "lucide-react";
import type { Categorie } from "@/types/produit";

interface CategoriesTabProps {
    categories: Categorie[];
    isLoading: boolean;
    onEdit: (categorie: Categorie) => void;
    onDelete: (categorie: Categorie) => void;
}

export default function CategoriesTab({
    categories,
    isLoading,
    onEdit,
    onDelete,
}: CategoriesTabProps) {
    if (isLoading) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                Chargement des catégories...
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3 text-muted-foreground">
                <Tag className="h-12 w-12 opacity-50" aria-hidden="true" />
                <p className="text-sm font-medium">Aucune catégorie créée</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                        <th className="text-left px-4 py-3 font-medium">Nom</th>
                        <th className="text-left px-4 py-3 font-medium">Description</th>
                        <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {categories.map((categorie) => (
                        <tr key={categorie.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium text-foreground">{categorie.nom}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                                {categorie.description || "—"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(categorie)}
                                        className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        aria-label="Modifier la catégorie"
                                    >
                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(categorie)}
                                        className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                                        aria-label="Supprimer la catégorie"
                                    >
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}