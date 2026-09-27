"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Utilisateur } from "@/types/utilisateur";
import type { ModifierProfilData } from "@/types/profil";
import ModifierProfilForm from "./ModifierProfilForm";

interface ParametresPageClientProps {
    utilisateur: Utilisateur;
}

export default function ParametresPageClient({ utilisateur }: ParametresPageClientProps) {
    const [utilisateurCourant, setUtilisateurCourant] = useState<Utilisateur>(utilisateur);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleModifierProfil(data: ModifierProfilData) {
        setIsSubmitting(true);

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
            toast.success("Profil mis à jour avec succès.");
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <ModifierProfilForm
                utilisateur={utilisateurCourant}
                onSubmit={handleModifierProfil}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}