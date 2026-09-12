"use client";

import { useState } from "react";
import type { Rapport } from "@/types/rapport";
import GenererRapportButton from "./GenererRapportButton";
import RapportCard from "./RapportCard";

interface RapportsSectionProps {
    rapportsInitiaux: Rapport[];
}

/**
 * Section "Rapports IA" : bouton de génération et liste
 * des rapports existants, le plus récent en premier.
 */
export default function RapportsSection({
    rapportsInitiaux,
}: RapportsSectionProps) {
    const [rapports, setRapports] = useState<Rapport[]>(rapportsInitiaux);

    /**
     * Ajoute le nouveau rapport au début de la liste
     * pour qu'il apparaisse en premier et soit ouvert par défaut.
     */
    const gestionnaireNouveauRapport = (nouveauRapport: Rapport) => {
        setRapports((precedent) => [nouveauRapport, ...precedent]);
    };

    return (
        <div className="space-y-4">
            {/* En-tête : titre et bouton de génération */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                    Rapports d{"'"}activité
                </h2>
                <GenererRapportButton onRapportGenere={gestionnaireNouveauRapport} />
            </div>

            {rapports.length === 0 ? (
                /* Aucun rapport disponible */
                <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                    Aucun rapport généré pour le moment.
                </p>
            ) : (
                /* Liste des rapports, le plus récent ouvert par défaut */
                <div className="space-y-3">
                    {rapports.map((rapport, index) => (
                        <RapportCard
                            key={rapport.id}
                            rapport={rapport}
                            ouvertParDefaut={index === 0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}