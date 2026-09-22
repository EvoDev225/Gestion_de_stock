"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Retour } from "@/types/retour";
import RetoursToolbar from "./RetoursToolbar";
import RetoursTable from "./RetoursTable";
import RetourCard from "./RetourCard";
import RetoursPagination from "./RetoursPagination";
import RetourFormModal from "./RetourFormModal";

interface RetoursPageClientProps {
    retoursInitiaux: Retour[];
}

type TypeFiltre = "TOUS" | "CLIENT" | "FOURNISSEUR";

const TAILLE_PAGE = 10;

export default function RetoursPageClient({
    retoursInitiaux,
}: RetoursPageClientProps) {
    const [retours, setRetours] = useState<Retour[]>(retoursInitiaux);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtreType, setFiltreType] = useState<TypeFiltre>("TOUS");
    const [pageActuelle, setPageActuelle] = useState<number>(1);

    const fetchRetours = useCallback(async () => {
        try {
            const res = await fetch("/api/retours");
            if (!res.ok) throw new Error("Erreur lors du chargement des retours");
            const data: Retour[] = await res.json();
            setRetours(data);
        } catch (error) {
            console.error(error);
            toast.error("Impossible de charger les retours.");
        }
    }, []);

    const handleSubmitRetour = async (data: {
        typeRetour: "CLIENT" | "FOURNISSEUR";
        venteId?: string;
        commandeFournisseurId?: string;
        motif?: string;
        lignes: { ligneVenteId?: string; lotId?: string; quantite: number }[];
    }) => {
        const res = await fetch("/api/retours", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            toast.error(errorBody.error ?? "Erreur lors de la creation du retour");
            throw new Error(errorBody.error ?? "Erreur lors de la creation du retour");
        }

        await fetchRetours();
        toast.success("Retour enregistre avec succes.");
    };

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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">Retours</h1>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    Nouveau retour
                </button>
            </div>

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

            <RetourFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitRetour}
            />
        </div>
    );
}