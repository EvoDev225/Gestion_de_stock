"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { Rapport } from "@/types/rapport";

interface GenererRapportButtonProps {
    onRapportGenere: (rapport: Rapport) => void;
}

/**
 * Bouton déclenchant la génération d'un nouveau rapport d'activité
 * via l'API POST /api/rapports/generer.
 */
export default function GenererRapportButton({
    onRapportGenere,
}: GenererRapportButtonProps) {
    const [enCours, setEnCours] = useState<boolean>(false);
    const [erreur, setErreur] = useState<string | null>(null);

    /**
     * Gestionnaire principal du clic sur le bouton.
     * Appelle l'API de génération et notifie le parent en cas de succès.
     */
    const gestionnaireClic = async () => {
        setEnCours(true);
        setErreur(null);

        try {
            const response = await fetch("/api/rapports/generer", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                let messageErreur = "Échec de la génération du rapport.";

                try {
                    const corps = (await response.json()) as {
                        erreur?: string;
                    };
                    if (corps.erreur) {
                        messageErreur = corps.erreur;
                    }
                } catch {
                    // Le corps n'est pas du JSON valide, on garde le message générique.
                }

                setErreur(messageErreur);
                return;
            }

            const rapport = (await response.json()) as Rapport;
            onRapportGenere(rapport);
        } catch {
            setErreur("Une erreur réseau est survenue.");
        } finally {
            setEnCours(false);
        }
    };

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={gestionnaireClic}
                disabled={enCours}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {enCours ? (
                    <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Génération en cours...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} aria-hidden="true" />
                        Générer un rapport
                    </>
                )}
            </button>

            {erreur !== null && (
                <p className="text-sm text-foreground">
                    Erreur : {erreur}
                </p>
            )}
        </div>
    );
}