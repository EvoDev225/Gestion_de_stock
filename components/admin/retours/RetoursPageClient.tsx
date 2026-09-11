"use client";

import { useMemo, useState } from "react";
import type { Retour } from "@/types/retour";
import RetoursToolbar from "./RetoursToolbar";
import RetoursTable from "./RetoursTable";
import RetourCard from "./RetourCard";
import RetoursPagination from "./RetoursPagination";

interface RetoursPageClientProps {
    retoursInitiaux: Retour[];
}

type TypeFiltre = "TOUS" | "CLIENT" | "FOURNISSEUR";

const TAILLE_PAGE = 10;

export default function RetoursPageClient({
    retoursInitiaux,
}: RetoursPageClientProps) {
    const [retours] = useState<Retour[]>(retoursInitiaux);
    const [filtreType, setFiltreType] = useState<TypeFiltre>("TOUS");
    const [pageActuelle, setPageActuelle] = useState<number>(1);

    // Calcul des compteurs basé sur la liste complète (non filtrée)
    const compteurs = useMemo(() => ({
        tous: retours.length,
        client: retours.filter((retour) => retour.typeRetour === "CLIENT").length,
        fournisseur: retours.filter((retour) => retour.typeRetour === "FOURNISSEUR").length,
    }), [retours]);

    // Filtre appliqué en mémoire
    const retoursFiltres = useMemo(() => {
        if (filtreType === "TOUS") return retours;
        return retours.filter((retour) => retour.typeRetour === filtreType);
    }, [retours, filtreType]);

    // Nombre total de pages après filtrage
    const nombrePages = useMemo(() => {
        return Math.max(1, Math.ceil(retoursFiltres.length / TAILLE_PAGE));
    }, [retoursFiltres.length]);

    // Retours paginés pour la page courante
    const retoursPagines = useMemo(() => {
        return retoursFiltres.slice(
            (pageActuelle - 1) * TAILLE_PAGE,
            pageActuelle * TAILLE_PAGE,
        );
    }, [retoursFiltres, pageActuelle]);

    // Gestionnaire qui réinitialise la page à 1 lors d'un changement de filtre
    const gestionnaireFiltreChange = (nouveauFiltre: TypeFiltre) => {
        setFiltreType(nouveauFiltre);
        setPageActuelle(1);
    };

    return (
        <div className="space-y-6">
            <RetoursToolbar
                filtreType={filtreType}
                onFiltreTypeChange={gestionnaireFiltreChange}
                compteurs={compteurs}
            />

            {retoursFiltres.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    Aucun retour trouvé pour ce filtre.
                </p>
            ) : (
                <>
                    {/* Vue tableau pour desktop */}
                    <div className="hidden md:block">
                        <RetoursTable retours={retoursPagines} />
                    </div>

                    {/* Vue cartes pour mobile */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {retoursPagines.map((retour) => (
                            <RetourCard key={retour.id} retour={retour} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <RetoursPagination
                        pageActuelle={pageActuelle}
                        nombrePages={nombrePages}
                        onPageChange={setPageActuelle}
                    />
                </>
            )}
        </div>
    );
}