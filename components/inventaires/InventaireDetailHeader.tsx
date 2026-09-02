"use client";

import { ArrowLeft, Clock, CheckCircle2 } from "lucide-react";
import type { Inventaire } from "@/types/inventaire";

interface InventaireDetailHeaderProps {
    inventaire: Inventaire;
    canValidate: boolean;
    onValidateClick: () => void;
    onBackClick: () => void;
}

// Fonction locale de formatage de date en fr-FR
function formatDate(dateInput: string | Date | undefined | null): string {
    if (!dateInput) return "—";
    const date = new Date(dateInput);
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Fonction locale pour formater l'ID utilisateur
function formatUserId(userId: string | undefined | null): string {
    if (!userId) return "—";
    return `Utilisateur #${userId.slice(0, 8)}`;
}

export default function InventaireDetailHeader({
    inventaire,
    canValidate,
    onValidateClick,
    onBackClick,
}: InventaireDetailHeaderProps) {
    const isValide = inventaire.statut === "VALIDE";

    return (
        <div className="space-y-6">
            {/* Bouton retour */}
            <button
                onClick={onBackClick}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour
            </button>

            {/* En-tête principal */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                {/* Section Informations (Gauche) */}
                <div className="space-y-4">
                    {/* Titre et Badge Statut */}
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-bold text-2xl text-foreground">
                            Inventaire du {formatDate(inventaire.dateLancement)}
                        </h1>

                        {isValide ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Validé
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                                <Clock className="h-3.5 w-3.5" />
                                En cours
                            </span>
                        )}
                    </div>

                    {/* Détails Lanceur / Validateur */}
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                            <span className="font-medium text-foreground">Lancé par :</span>{" "}
                            {formatUserId(inventaire.utilisateurId)}
                        </p>

                        {isValide && inventaire.utilisateurValidateurId && (
                            <p>
                                <span className="font-medium text-foreground">Validé par :</span>{" "}
                                {formatUserId(inventaire.utilisateurValidateurId)}
                                {inventaire.dateValidation && (
                                    <span className="ml-2 text-xs">
                                        (le {formatDate(inventaire.dateValidation)})
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                {/* Section Action (Droite) */}
                {canValidate && (
                    <div className="flex items-start sm:items-center">
                        <button
                            onClick={onValidateClick}
                            className="bg-primary text-white rounded-lg px-4 py-2 font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Valider l'inventaire
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}