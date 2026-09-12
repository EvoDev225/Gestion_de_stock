"use client";

import { useState } from "react";
import type { Utilisateur } from "@/types/utilisateur";
import type { ModifierProfilData } from "@/types/profil";
import ModifierProfilForm from "./ModifierProfilForm";

interface ParametresPageClientProps {
    utilisateur: Utilisateur;
}

export default function ParametresPageClient({ utilisateur }: ParametresPageClientProps) {
    const [utilisateurCourant, setUtilisateurCourant] = useState<Utilisateur>(utilisateur);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erreurApi, setErreurApi] = useState<string | null>(null);
    const [succesMessage, setSuccesMessage] = useState<string | null>(null);

    async function handleModifierProfil(data: ModifierProfilData) {
        setIsSubmitting(true);
        setErreurApi(null);
        setSuccesMessage(null);

        try {
            const response = await fetch("/api/profil", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.error || "Une erreur est survenue.");
            }

            setUtilisateurCourant(result);
            setSuccesMessage("Profil mis à jour avec succès.");

            setTimeout(() => {
                setSuccesMessage(null);
            }, 3000);
        } catch (error) {
            setErreurApi((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            {erreurApi && (
                <div className="rounded-md border border-border bg-card p-4">
                    <p className="text-sm font-medium text-destructive">{erreurApi}</p>
                </div>
            )}

            {succesMessage && (
                <div className="rounded-md border border-border bg-card p-4">
                    <p className="text-sm font-medium text-foreground">{succesMessage}</p>
                </div>
            )}

            <ModifierProfilForm
                utilisateur={utilisateurCourant}
                onSubmit={handleModifierProfil}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}