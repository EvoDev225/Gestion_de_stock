"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import type { NouvelUtilisateurData, RoleUtilisateur } from "@/types/utilisateur";

interface NouvelUtilisateurModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: NouvelUtilisateurData) => Promise<void>;
    isSubmitting: boolean;
}

interface FormErrors {
    nom?: string;
    email?: string;
    motDePasse?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NouvelUtilisateurModal({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
}: NouvelUtilisateurModalProps) {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [role, setRole] = useState<RoleUtilisateur>("EMPLOYEE");
    const [errors, setErrors] = useState<FormErrors>({});

    const resetForm = useCallback(() => {
        setNom("");
        setEmail("");
        setMotDePasse("");
        setRole("EMPLOYEE");
        setErrors({});
    }, []);

    useEffect(() => {
        if (isOpen) resetForm();
    }, [isOpen, resetForm]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isSubmitting) onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, isSubmitting, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
    };

    const handleSubmit = async () => {
        const newErrors: FormErrors = {};

        if (!nom.trim()) newErrors.nom = "Le nom est requis.";
        if (!email.trim()) {
            newErrors.email = "L'email est requis.";
        } else if (!EMAIL_REGEX.test(email.trim())) {
            newErrors.email = "Format d'email invalide.";
        }
        if (!motDePasse) {
            newErrors.motDePasse = "Le mot de passe est requis.";
        } else if (motDePasse.length < 8) {
            newErrors.motDePasse = "Le mot de passe doit contenir au moins 8 caractères.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await onSubmit({ nom: nom.trim(), email: email.trim(), motDePasse, role });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Nouvel utilisateur</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-foreground mb-1">
                            Nom <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="nom"
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        />
                        {errors.nom && <p className="mt-1 text-sm text-destructive">{errors.nom}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                            Email <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        />
                        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="motDePasse" className="block text-sm font-medium text-foreground mb-1">
                            Mot de passe <span className="text-destructive">*</span>
                        </label>
                        <input
                            id="motDePasse"
                            type="password"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        />
                        {errors.motDePasse && <p className="mt-1 text-sm text-destructive">{errors.motDePasse}</p>}
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                            Rôle
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value as RoleUtilisateur)}
                            className="block w-full rounded-lg border border-border bg-background text-foreground text-sm p-2 focus:border-primary focus:ring-primary"
                        >
                            <option value="EMPLOYEE">Employé</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Création..." : "Créer l'utilisateur"}
                    </button>
                </div>
            </div>
        </div>
    );
}