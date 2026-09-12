"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
    type: string;
    label: string;
    parametres?: Record<string, string>;
}

/**
 * Bouton déclenchant le téléchargement d'un export Excel.
 *
 * L'export est récupéré sous forme de blob via fetch avec les cookies
 * d'authentification (credentials: "include"), puis le téléchargement
 * est déclenché côté navigateur via un lien temporaire.
 */
export default function ExportButton({
    type,
    label,
    parametres,
}: ExportButtonProps) {
    const [enCours, setEnCours] = useState<boolean>(false);
    const [erreur, setErreur] = useState<string | null>(null);

    /**
     * Gestionnaire du clic : construit l'URL, appelle l'API d'export,
     * puis déclenche le téléchargement du fichier généré.
     */
    const gestionnaireClic = async () => {
        setEnCours(true);
        setErreur(null);

        try {
            // Construction de l'URL avec les paramètres non vides.
            let url = `/api/exports/${type}`;

            if (parametres) {
                const params = new URLSearchParams();

                for (const [cle, valeur] of Object.entries(parametres)) {
                    if (valeur !== "") {
                        params.append(cle, valeur);
                    }
                }

                const chaineParams = params.toString();

                if (chaineParams) {
                    url += `?${chaineParams}`;
                }
            }

            const response = await fetch(url, {
                credentials: "include",
            });

            // Gestion des erreurs renvoyées par l'API.
            if (!response.ok) {
                let messageErreur = "Échec de l'export.";

                try {
                    const corps = await response.json();

                    if (typeof corps.message === "string" && corps.message) {
                        messageErreur = corps.message;
                    } else if (
                        typeof corps.erreur === "string" &&
                        corps.erreur
                    ) {
                        messageErreur = corps.erreur;
                    }
                } catch {
                    // Le corps n'est pas un JSON exploitable, on garde le message générique.
                }

                setErreur(messageErreur);
                return;
            }

            // Récupération du fichier sous forme de blob.
            const blob = await response.blob();

            // Détermination du nom de fichier depuis l'en-tête content-disposition.
            let nomFichier = `export_${type}_${Date.now()}.xlsx`;

            const contentDisposition = response.headers.get("content-disposition");

            if (contentDisposition) {
                const correspondance = /filename="?([^"]+)"?/.exec(
                    contentDisposition,
                );

                if (correspondance && correspondance[1]) {
                    nomFichier = correspondance[1];
                }
            }

            // Déclenchement du téléchargement via un lien temporaire.
            const urlObjet = URL.createObjectURL(blob);
            const lien = document.createElement("a");

            lien.href = urlObjet;
            lien.download = nomFichier;

            document.body.appendChild(lien);
            lien.click();
            document.body.removeChild(lien);

            URL.revokeObjectURL(urlObjet);
        } catch {
            setErreur("Une erreur réseau est survenue.");
        } finally {
            setEnCours(false);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <button
                type="button"
                onClick={gestionnaireClic}
                disabled={enCours}
                className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
                {enCours ? (
                    <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Export en cours...
                    </>
                ) : (
                    <>
                        <Download size={16} aria-hidden="true" />
                        {label}
                    </>
                )}
            </button>

            {erreur !== null && (
                <p className="text-xs text-muted-foreground">
                    Erreur : {erreur}
                </p>
            )}
        </div>
    );
}