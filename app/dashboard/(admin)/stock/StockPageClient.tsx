"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import StockPageHeader from "@/components/stock/StockPageHeader";
import StockTabs from "@/components/stock/StockTabs";
import LotsToolbar from "@/components/stock/LotsToolbar";
import ConfirmDialog from "@/components/ui/ConfirmDialog"; // <-- CHEMIN CORRIGÉ ICI
import LotsTable from "@/components/stock/LotsTable";
import LotCard from "@/components/stock/LotCard";
import LotFormModal from "@/components/stock/LotFormModal";
import MouvementsTable from "@/components/stock/MouvementsTable";
import MouvementCard from "@/components/stock/MouvementCard";
import StockPagination from "@/components/stock/StockPagination";
import type { Lot } from "@/types/lot";
import type { MouvementStock } from "@/types/mouvement";
import type { Produit } from "@/types/produit";

const ITEMS_PER_PAGE = 10;

export default function StockPageClient({ role = "ADMIN" }: { role?: "ADMIN" | "EMPLOYEE" } = {}) {
    const [activeTab, setActiveTab] = useState<"lots" | "mouvements">("lots");

    // ── Données ──
    const [lots, setLots] = useState<Lot[]>([]);
    const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [isLoadingLots, setIsLoadingLots] = useState(true);
    const [isLoadingMouvements, setIsLoadingMouvements] = useState(true);

    // ── Filtres Lots ──
    const [searchValue, setSearchValue] = useState("");
    const [expirationFilter, setExpirationFilter] = useState<"tous" | "bientot" | "expires">("tous");

    // ── Pagination ──
    const [lotsPage, setLotsPage] = useState(1);
    const [mouvementsPage, setMouvementsPage] = useState(1);

    // ── Modal lot ──
    const [isLotModalOpen, setIsLotModalOpen] = useState(false);
    const [lotEnEdition, setLotEnEdition] = useState<Lot | null>(null);
    const [lotASupprimer, setLotASupprimer] = useState<Lot | null>(null);

    // ── Chargement ──
    const fetchLots = useCallback(async () => {
        try {
            const res = await fetch("/api/lots");
            if (!res.ok) throw new Error("Erreur lors du chargement des lots");
            const data: Lot[] = await res.json();
            setLots(data);
        } catch (error) {
            console.error(error);
            toast.error("Impossible de charger les lots.");
        }
    }, []);

    const fetchMouvements = useCallback(async () => {
        try {
            const res = await fetch("/api/mouvements-stock");
            if (!res.ok) throw new Error("Erreur lors du chargement des mouvements");
            const data: MouvementStock[] = await res.json();
            setMouvements(data);
        } catch (error) {
            console.error(error);
            toast.error("Impossible de charger les mouvements.");
        }
    }, []);

    const fetchProduits = useCallback(async () => {
        try {
            const res = await fetch("/api/produits");
            if (!res.ok) throw new Error("Erreur lors du chargement des produits");
            const data: Produit[] = await res.json();
            setProduits(data);
        } catch (error) {
            console.error(error);
            toast.error("Impossible de charger les produits.");
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setIsLoadingLots(true);
            setIsLoadingMouvements(true);
            
            await Promise.all([
                fetchLots().finally(() => setIsLoadingLots(false)),
                fetchMouvements().finally(() => setIsLoadingMouvements(false)),
                fetchProduits()
            ]);
        };
        loadData();
    }, [fetchLots, fetchMouvements, fetchProduits]);

    // ── Filtrage des lots ──
    const lotsFiltres = useMemo(() => {
        return lots.filter((lot) => {
            const search = searchValue.trim().toLowerCase();
            const matchSearch =
                search === "" ||
                lot.numeroLot.toLowerCase().includes(search) ||
                lot.produit?.nom.toLowerCase().includes(search) ||
                lot.variante?.nomVariante.toLowerCase().includes(search);

            let matchExpiration = true;
            if (expirationFilter !== "tous" && lot.dateExpiration) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const expDate = new Date(lot.dateExpiration);
                expDate.setHours(0, 0, 0, 0);
                const daysUntil = Math.ceil(
                    (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (expirationFilter === "expires") {
                    matchExpiration = daysUntil < 0;
                } else if (expirationFilter === "bientot") {
                    matchExpiration = daysUntil >= 0 && daysUntil <= 30;
                }
            } else if (expirationFilter !== "tous" && !lot.dateExpiration) {
                matchExpiration = false;
            }

            return matchSearch && matchExpiration;
        });
    }, [lots, searchValue, expirationFilter]);

    // ── Handlers pour réinitialiser la pagination SANS useEffect (CORRECTION REACT) ──
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        setLotsPage(1); // Réinitialise la page au moment du changement
    };

    const handleExpirationChange = (value: "tous" | "bientot" | "expires") => {
        setExpirationFilter(value);
        setLotsPage(1); // Réinitialise la page au moment du changement
    };

    const totalLotsPages = Math.max(1, Math.ceil(lotsFiltres.length / ITEMS_PER_PAGE));
    const lotsPagePagines = useMemo(() => {
        const start = (lotsPage - 1) * ITEMS_PER_PAGE;
        return lotsFiltres.slice(start, start + ITEMS_PER_PAGE);
    }, [lotsFiltres, lotsPage]);

    const totalMouvementsPages = Math.max(1, Math.ceil(mouvements.length / ITEMS_PER_PAGE));
    const mouvementsPagines = useMemo(() => {
        const start = (mouvementsPage - 1) * ITEMS_PER_PAGE;
        return mouvements.slice(start, start + ITEMS_PER_PAGE);
    }, [mouvements, mouvementsPage]);

    // ── Actions lot ──
    const handleOpenCreateLot = () => {
        setLotEnEdition(null);
        setIsLotModalOpen(true);
    };

    const handleOpenEditLot = (lot: Lot) => {
        setLotEnEdition(lot);
        setIsLotModalOpen(true);
    };

    const handleSubmitLot = async (data: {
    numeroLot?: string; // <-- AJOUTE CE POINT D'INTERROGATION ICI
    quantite: number;
    dateReception: string;
    dateExpiration: string;
    produitId: string | null;
    varianteId: string | null;
}) => {
    const isEdition = lotEnEdition !== null;
    const url = isEdition ? `/api/lots/${lotEnEdition!.id}` : "/api/lots";
    const method = isEdition ? "PATCH" : "POST";

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody.error ?? "Erreur lors de l'enregistrement du lot";
        toast.error(message);
        throw new Error(message);
    }

    await fetchLots();
    toast.success(isEdition ? "Lot modifié avec succès." : "Lot créé avec succès.");
};

    const handleOpenDeleteLot = (lot: Lot) => {
        setLotASupprimer(lot);
    };

    const confirmDeleteLot = async () => {
        if (!lotASupprimer) return;

        try {
            const res = await fetch(`/api/lots/${lotASupprimer.id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error ?? "Erreur lors de la suppression du lot");
            }
            await fetchLots();
            toast.success("Lot supprimé avec succès.");
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression du lot.");
        } finally {
            setLotASupprimer(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <StockPageHeader onCreateLotClick={handleOpenCreateLot} role={role} />

            <StockTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                lotsCount={lots.length}
                mouvementsCount={mouvements.length}
            />

            {activeTab === "lots" ? (
                <>
                    <LotsToolbar
                        searchValue={searchValue}
                        onSearchChange={handleSearchChange} // <-- Utilise le handler corrigé
                        expirationFilter={expirationFilter}
                        onExpirationFilterChange={handleExpirationChange} // <-- Utilise le handler corrigé
                    />

                    {isLoadingLots ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            Chargement des lots...
                        </div>
                    ) : (
                        <>
                            <LotsTable
                                lots={lotsPagePagines}
                                onEdit={handleOpenEditLot}
                                onDelete={handleOpenDeleteLot}
                                role={role}
                            />

                            <div className="flex flex-col gap-3 lg:hidden">
                                {lotsPagePagines.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground text-sm">
                                        Aucun lot trouvé
                                    </div>
                                ) : (
                                    lotsPagePagines.map((lot) => (
                                        <LotCard
                                            key={lot.id}
                                            lot={lot}
                                            onEdit={handleOpenEditLot}
                                            onDelete={handleOpenDeleteLot}
                                            role={role}
                                        />
                                    ))
                                )}
                            </div>

                            <StockPagination
                                currentPage={lotsPage}
                                totalPages={totalLotsPages}
                                totalItems={lotsFiltres.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setLotsPage}
                                itemLabel="lots"
                            />
                        </>
                    )}
                </>
            ) : (
                <>
                    {isLoadingMouvements ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">
                            Chargement des mouvements...
                        </div>
                    ) : (
                        <>
                            <MouvementsTable mouvements={mouvementsPagines} />

                            <div className="flex flex-col gap-3 lg:hidden">
                                {mouvementsPagines.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground text-sm">
                                        Aucun mouvement enregistré
                                    </div>
                                ) : (
                                    mouvementsPagines.map((mouvement) => (
                                        <MouvementCard key={mouvement.id} mouvement={mouvement} />
                                    ))
                                )}
                            </div>

                            <StockPagination
                                currentPage={mouvementsPage}
                                totalPages={totalMouvementsPages}
                                totalItems={mouvements.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setMouvementsPage}
                                itemLabel="mouvements"
                            />
                        </>
                    )}
                </>
            )}
            
            <ConfirmDialog
                isOpen={lotASupprimer !== null}
                onClose={() => setLotASupprimer(null)}
                onConfirm={confirmDeleteLot}
                title="Supprimer ce lot ?"
                description={`Le lot "${lotASupprimer?.numeroLot}" sera supprimé définitivement. Cette action est irréversible.`}
                variant="danger"
                confirmLabel="Supprimer"
            />
            
            <LotFormModal
                key={lotEnEdition?.id ?? "nouveau-lot"}
                isOpen={isLotModalOpen}
                onClose={() => setIsLotModalOpen(false)}
                lot={lotEnEdition}
                produits={produits}
                onSubmit={handleSubmitLot}
            />
        </div>
    );
}