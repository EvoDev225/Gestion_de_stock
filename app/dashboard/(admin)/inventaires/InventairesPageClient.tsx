"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InventairesPageHeader from "@/components/inventaires/InventairesPageHeader";
import InventairesToolbar from "@/components/inventaires/InventairesToolbar";
import InventairesTable from "@/components/inventaires/InventairesTable";
import InventaireCard from "@/components/inventaires/InventaireCard";
import InventairesPagination from "@/components/inventaires/InventairesPagination";
import NouvelInventaireModal from "@/components/inventaires/NouvelInventaireModal";
import type { Inventaire } from "@/types/inventaire";
import type { Produit } from "@/types/produit";

const ITEMS_PER_PAGE = 10;

type StatusFilter = "tous" | "en_cours" | "valide";

export default function InventairesPageClient() {
    const router = useRouter();

    const [inventaires, setInventaires] = useState<Inventaire[]>([]);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
    const [currentPage, setCurrentPage] = useState(1);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // ── Chargement ──
    const fetchInventaires = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/inventaires");
            if (!res.ok) throw new Error("Erreur lors du chargement des inventaires");
            const data: Inventaire[] = await res.json();
            setInventaires(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchProduits = useCallback(async () => {
        try {
            const res = await fetch("/api/produits");
            if (!res.ok) throw new Error("Erreur lors du chargement des produits");
            const data: Produit[] = await res.json();
            setProduits(data.filter((p) => !p.archive));
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchInventaires();
        fetchProduits();
    }, [fetchInventaires, fetchProduits]);

    // ── Filtrage + pagination ──
    const inventairesFiltres = useMemo(() => {
        return inventaires.filter((inv) => {
            if (statusFilter === "en_cours") return inv.statut === "EN_COURS";
            if (statusFilter === "valide") return inv.statut === "VALIDE";
            return true;
        });
    }, [inventaires, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    const totalPages = Math.max(1, Math.ceil(inventairesFiltres.length / ITEMS_PER_PAGE));
    const inventairesPage = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return inventairesFiltres.slice(start, start + ITEMS_PER_PAGE);
    }, [inventairesFiltres, currentPage]);

    // Un inventaire EN_COURS bloque déjà la création côté backend (409),
    // mais on désactive aussi le bouton côté UI pour éviter l'aller-retour inutile.
    const aUnInventaireEnCours = useMemo(
        () => inventaires.some((inv) => inv.statut === "EN_COURS"),
        [inventaires]
    );

    // ── Actions ──
    const handleView = (inventaire: Inventaire) => {
        router.push(`/dashboard/inventaires/${inventaire.id}`);
    };

    const handleCreateInventaire = async (produitIds: string[]) => {
        setCreateError(null);
        try {
            const res = await fetch("/api/inventaires", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produitIds }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error ?? "Erreur lors du lancement de l'inventaire");
            }

            const nouvelInventaire: Inventaire = await res.json();
            await fetchInventaires();
            router.push(`/dashboard/inventaires/${nouvelInventaire.id}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            setCreateError(message);
            throw error; // relance pour que la modal reste ouverte et affiche isSubmitting correctement
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <InventairesPageHeader
                onCreateClick={() => {
                    setCreateError(null);
                    setIsCreateModalOpen(true);
                }}
            />

            {aUnInventaireEnCours && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
                    Un inventaire est déjà en cours. Il doit être validé avant d'en lancer un nouveau.
                </div>
            )}

            <InventairesToolbar
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                    Chargement des inventaires...
                </div>
            ) : (
                <>
                    <div className="hidden lg:block">
                        <InventairesTable inventaires={inventairesPage} onView={handleView} />
                    </div>

                    <div className="flex flex-col gap-3 lg:hidden">
                        {inventairesPage.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                Aucun inventaire trouvé
                            </div>
                        ) : (
                            inventairesPage.map((inventaire) => (
                                <InventaireCard
                                    key={inventaire.id}
                                    inventaire={inventaire}
                                    onView={handleView}
                                />
                            ))
                        )}
                    </div>

                    <InventairesPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={inventairesFiltres.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                        itemLabel="inventaires"
                    />
                </>
            )}

            <NouvelInventaireModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                produits={produits}
                onSubmit={handleCreateInventaire}
            />

            {createError && (
                <div className="fixed bottom-6 right-6 max-w-sm rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-lg">
                    {createError}
                </div>
            )}
        </div>
    );
}