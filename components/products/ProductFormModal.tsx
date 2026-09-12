"use client";

import { useState, useRef } from "react";
import { X, UploadCloud, Loader2 } from "lucide-react";
import type { Produit, Categorie } from "@/types/produit";
import { toast } from "sonner";
import Image from "next/image";

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    produit: Produit | null;
    categories: Categorie[];
    onSubmit: (data: {
        nom: string;
        sku: string;
        description: string;
        categorieId: string | null;
        prixAchat: string;
        prixVente: string;
        seuilMinimum: number;
        imageUrl: string | null;
    }) => Promise<void>;
}

export default function ProductFormModal({
    isOpen,
    onClose,
    produit,
    categories,
    onSubmit,
}: ProductFormModalProps) {
    const [nom, setNom] = useState(produit?.nom ?? "");
    const [sku, setSku] = useState(produit?.sku ?? "");
    const [description, setDescription] = useState(produit?.description ?? "");
    const [categorieId, setCategorieId] = useState<string | null>(produit?.categorie?.id ?? null);
    const [prixAchat, setPrixAchat] = useState(produit?.prixAchat?.toString() ?? "");
    const [prixVente, setPrixVente] = useState(produit?.prixVente?.toString() ?? "");
    const [seuilMinimum, setSeuilMinimum] = useState<number>(produit?.seuilMinimum ?? 0);
    const [imageUrl, setImageUrl] = useState<string | null>(produit?.imageUrl ?? null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Nouveaux états pour la gestion de l'upload d'image
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [apercuLocal, setApercuLocal] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit({
                nom,
                sku,
                description,
                categorieId,
                prixAchat,
                prixVente,
                seuilMinimum,
                imageUrl,
            });
            onClose();
        } catch (error) {
            console.error("Erreur lors de la soumission du produit :", error);
        } finally {
            setIsSubmitting(false);
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
                className="w-full max-w-2xl bg-card h-full shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="px-8 py-6 border-b border-border flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-semibold text-foreground">
                        {produit ? "Modifier le produit" : "Nouveau produit"}
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

                {/* ── Corps scrollable ── */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="flex flex-col gap-6">
                        {/* Zone Upload Image */}
                        <div
                            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // Aperçu local immédiat pendant l'upload (jamais envoyé au serveur, jamais stocké dans imageUrl)
                                    const objectUrl = URL.createObjectURL(file);
                                    setApercuLocal(objectUrl);
                                    setIsUploadingImage(true);

                                    try {
                                        const formData = new FormData();
                                        formData.append("file", file);

                                        const res = await fetch("/api/upload/produits", {
                                            method: "POST",
                                            body: formData,
                                        });

                                        if (!res.ok) {
                                            const errorBody = await res.json().catch(() => ({}));
                                            throw new Error(errorBody.error ?? "Erreur lors de l'upload de l'image");
                                        }

                                        const data: { url: string } = await res.json();
                                        setImageUrl(data.url);
                                        toast.success("Image téléchargée avec succès.");
                                    } catch (error) {
                                        console.error("Erreur lors de l'upload de l'image :", error);
                                        toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload de l'image.");
                                        setApercuLocal(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    } finally {
                                        setIsUploadingImage(false);
                                    }
                                }}
                            />
                            {isUploadingImage ? (
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-10 w-10 mb-2 animate-spin" aria-hidden="true" />
                                    <span className="text-sm font-medium">Téléchargement en cours...</span>
                                </div>
                            ) : apercuLocal ?? imageUrl ? (
                                <div className="relative w-full max-w-xs h-48"> {/* ← h-48 déplacé ici pour le fill */}
                                    <Image
                                        src={apercuLocal ?? imageUrl ?? ""}
                                        alt="Aperçu du produit"
                                        fill
                                        unoptimized
                                        className="object-cover rounded-lg border border-border"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 p-1.5 bg-card rounded-full border border-border text-muted-foreground hover:text-destructive transition-colors z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageUrl(null);
                                            setApercuLocal(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        aria-label="Supprimer l'image"
                                    >
                                        <X className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="h-10 w-10 mb-2" aria-hidden="true" />
                                    <span className="text-sm font-medium">
                                        Cliquez ou glissez une image ici
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Grille de champs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Nom */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="nom" className="text-sm font-medium text-foreground">
                                    Nom du produit
                                </label>
                                <input
                                    id="nom"
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            {/* SKU */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="sku" className="text-sm font-medium text-foreground">
                                    SKU
                                </label>
                                <input
                                    id="sku"
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                                    className="font-mono rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            {/* Catégorie */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="categorie" className="text-sm font-medium text-foreground">
                                    Catégorie
                                </label>
                                <select
                                    id="categorie"
                                    value={categorieId || ""}
                                    onChange={(e) => setCategorieId(e.target.value || null)}
                                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Aucune catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Seuil minimum */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="seuil" className="text-sm font-medium text-foreground">
                                    Seuil minimum
                                </label>
                                <input
                                    id="seuil"
                                    type="number"
                                    min="0"
                                    value={seuilMinimum}
                                    onChange={(e) => setSeuilMinimum(Number(e.target.value))}
                                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <span className="text-xs text-muted-foreground">
                                    Alerte quand le stock passe sous ce seuil
                                </span>
                            </div>

                            {/* Prix d'achat */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="prixAchat" className="text-sm font-medium text-foreground">
                                    Prix d'achat
                                </label>
                                <div className="relative">
                                    <input
                                        id="prixAchat"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={prixAchat}
                                        onChange={(e) => setPrixAchat(e.target.value)}
                                        className="w-full rounded-lg border border-border bg-card px-3 py-2 pr-14 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        FCFA
                                    </span>
                                </div>
                            </div>

                            {/* Prix de vente */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="prixVente" className="text-sm font-medium text-foreground">
                                    Prix de vente
                                </label>
                                <div className="relative">
                                    <input
                                        id="prixVente"
                                        type="number"
                                        step="1"
                                        min="0"
                                        value={prixVente}
                                        onChange={(e) => setPrixVente(e.target.value)}
                                        className="w-full rounded-lg border border-border bg-card px-3 py-2 pr-14 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        FCFA
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2 sm:col-span-2">
                                <label htmlFor="description" className="text-sm font-medium text-foreground">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="px-8 py-6 border-t border-border flex justify-end gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isUploadingImage}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}