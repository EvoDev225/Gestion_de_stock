"use client";

import { useState, useMemo } from "react";
import type { Retour } from "@/types/retour";
import RetoursToolbar from "./RetoursToolbar";
import RetoursTable from "./RetoursTable";
import RetourCard from "./RetourCard";

interface RetoursPageClientProps {
    retoursInitiaux: Retour[];
}

type TypeFiltre = "TOUS" | "CLIENT" | "FOURNISSEUR";

export default function RetoursPageClient({ retoursInitiaux }: RetoursPageClientProps) {
    const [retours] = useState<Retour[]>(retoursInitiaux);
    const [filtreType, setFiltreType] = useState<TypeFiltre>("TOUS");

    const retoursFiltres = useMemo(() => {
        if (filtreType === "TOUS") return retours;
        return retours.filter((retour) => retour.typeRetour === filtreType);
    }, [retours, filtreType]);

    return (
        <div className="space-y-6">
            <RetoursToolbar filtreType={filtreType} onFiltreTypeChange={setFiltreType} />

            <div className="hidden md:block">
                <RetoursTable retours={retoursFiltres} />
            </div>

            <div className="md:hidden grid grid-cols-1 gap-4">
                {retoursFiltres.map((retour) => (
                    <RetourCard key={retour.id} retour={retour} />
                ))}
                {retoursFiltres.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        Aucun retour trouvé pour ce filtre.
                    </p>
                )}
            </div>
        </div>
    );
}