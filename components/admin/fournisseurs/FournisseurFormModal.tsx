"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Fournisseur, FournisseurFormData } from "@/types/fournisseur";

interface FournisseurFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FournisseurFormData) => Promise<void>;
    fournisseurAEditer?: Fournisseur | null;
    isSubmitting: boolean;
}

type FournisseurFormErrors = Partial<Record<keyof FournisseurFormData, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FournisseurFormModal({
    isOpen,
    onClose,
    onSubmit,
    fournisseurAEditer,
    isSubmitting,
}: FournisseurFormModalProps) {
    const [formData, setFormData] = useState<FournisseurFormData>(() =>
        fournisseurAEditer
            ? {
                nom: fournisseurAEditer.nom,
                email: fournisseurAEditer.email ?? "",
                telephone: fournisseurAEditer.telephone,
                adresse: fournisseurAEditer.adresse,
            }
            : {
                nom: "",
                email: "",
                telephone: "",
                adresse: "",
            }
    );

    const [erreurs, setErreurs] = useState<FournisseurFormErrors>({});

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const updateField = (champ: keyof FournisseurFormData, valeur: string) => {
        setFormData((prev) => ({
            ...prev,
            [champ]: valeur,
        }));

        setErreurs((prev) => ({
            ...prev,
            [champ]: undefined,
        }));
    };

    const handleSubmit = async () => {
        const nouvellesErreurs: FournisseurFormErrors = {};

        if (!formData.nom.trim()) {
            nouvellesErreurs.nom = "Le nom est requis.";
        }

        if (!formData.telephone.trim()) {
            nouvellesErreurs.telephone = "Le téléphone est requis.";
        }

        if (!formData.adresse.trim()) {
            nouvellesErreurs.adresse = "L'adresse est requise.";
        }

        if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
            nouvellesErreurs.email = "L'email est invalide.";
        }

        if (Object.keys(nouvellesErreurs).length > 0) {
            setErreurs(nouvellesErreurs);
            return;
        }

        await onSubmit({
            nom: formData.nom.trim(),
            email: formData.email.trim(),
            telephone: formData.telephone.trim(),
            adresse: formData.adresse.trim(),
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-0 duration-200"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={
                    fournisseurAEditer ? "Modifier le fournisseur" : "Nouveau fournisseur"
                }
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg animate-in zoom-in-95 duration-200"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-gray-900">
                    {fournisseurAEditer ? "Modifier le fournisseur" : "Nouveau fournisseur"}
                </h2>

                <div className="mt-4 space-y-4">
                    <div>
                        <label
                            htmlFor="fournisseur-nom"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Nom
                        </label>
                        <input
                            id="fournisseur-nom"
                            type="text"
                            value={formData.nom}
                            onChange={(event) => updateField("nom", event.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 ${erreurs.nom ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {erreurs.nom && (
                            <p className="mt-1 text-xs text-red-600">{erreurs.nom}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="fournisseur-email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="fournisseur-email"
                            type="email"
                            value={formData.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            placeholder="Optionnel"
                            className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 ${erreurs.email ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {erreurs.email && (
                            <p className="mt-1 text-xs text-red-600">{erreurs.email}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="fournisseur-telephone"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Téléphone
                        </label>
                        <input
                            id="fournisseur-telephone"
                            type="text"
                            value={formData.telephone}
                            onChange={(event) => updateField("telephone", event.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 ${erreurs.telephone ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {erreurs.telephone && (
                            <p className="mt-1 text-xs text-red-600">{erreurs.telephone}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="fournisseur-adresse"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Adresse
                        </label>
                        <textarea
                            id="fournisseur-adresse"
                            rows={3}
                            value={formData.adresse}
                            onChange={(event) => updateField("adresse", event.target.value)}
                            className={`w-full resize-none rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 ${erreurs.adresse ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {erreurs.adresse && (
                            <p className="mt-1 text-xs text-red-600">{erreurs.adresse}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        onClick={() => void handleSubmit()}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}