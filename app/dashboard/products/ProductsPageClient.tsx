"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import ProductsPageHeader from "@/components/products/ProductsPageHeader";
import LowStockBanner from "@/components/products/LowStockBanner";
import ProductsToolbar from "@/components/products/ProductsToolbar";
import ProductsTable from "@/components/products/ProductsTable";
import ProductCard from "@/components/products/ProductCard";
import ProductsPagination from "@/components/products/ProductsPagination";
import ProductFormModal from "@/components/products/ProductFormModal";
import VariantsPanel from "@/components/products/VariantsPanel";
import type { Produit, Categorie, Variante, StatutFiltre, VueAffichage } from "@/types/produit";

const ITEMS_PER_PAGE = 10;

export default function ProductsPageClient() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filtres
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatutFiltre>("tous");
    const [view, setView] = useState<VueAffichage>("table");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal produit (création / édition)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(null);

    // Panneau variantes
    const [isVariantsPanelOpen, setIsVariantsPanelOpen] = useState(false);
    const [produitPourVariantes, setProduitPourVariantes] = useState<Produit | null>(null);
    const [variantes, setVariantes] = useState<Variante[]>([]);

    // ── Chargement initial : produits + catégories ──
    const fetchProduits = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/produits");
            if (!res.ok) throw new Error("Erreur lors du chargement des produits");
            const data: Produit[] = await res.json();
            setProduits(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
            const data: Categorie[] = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchProduits();
        fetchCategories();
    }, [fetchProduits, fetchCategories]);

    // ── Filtrage + pagination côté client ──
    const produitsFiltres = useMemo(() => {
        return produits.filter((p) => {
            const matchSearch =
                searchValue.trim() === "" ||
                p.nom.toLowerCase().includes(searchValue.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchValue.toLowerCase());

            const matchCategorie =
                !selectedCategoryId || p.categorieId === selectedCategoryId;

            const matchStatut =
                statusFilter === "tous" ||
                (statusFilter === "actifs" && !p.archive) ||
                (statusFilter === "archives" && p.archive);

            return matchSearch && matchCategorie && matchStatut;
        });
    }, [produits, searchValue, selectedCategoryId, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(produitsFiltres.length / ITEMS_PER_PAGE));

    const produitsPage = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return produitsFiltres.slice(start, start + ITEMS_PER_PAGE);
    }, [produitsFiltres, currentPage]);

    // Ramène à la page 1 si les filtres changent la longueur de la liste
    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue, selectedCategoryId, statusFilter]);

    const produitsEnStockBas = useMemo(
        () => produits.filter((p) => !p.archive && p.quantiteStock <= p.seuilMinimum),
        [produits]
    );

    // ── Actions produit ──
    const handleOpenCreateModal = () => {
        setProduitEnEdition(null);
        setIsProductModalOpen(true);
    };

    const handleOpenEditModal = (produit: Produit) => {
        setProduitEnEdition(produit);
        setIsProductModalOpen(true);
    };

    const handleSubmitProduit = async (data: {
        nom: string;
        sku: string;
        description: string;
        categorieId: string | null;
        prixAchat: string;
        prixVente: string;
        seuilMinimum: number;
        quantiteStock: number;
        imageUrl: string | null;
    }) => {
        const isEdition = produitEnEdition !== null;
        const url = isEdition ? `/api/produits/${produitEnEdition!.id}` : "/api/produits";
        const method = isEdition ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            throw new Error(errorBody.error ?? "Erreur lors de l'enregistrement du produit");
        }

        await fetchProduits();
    };

    const handleArchiveToggle = async (produit: Produit) => {
        try {
            const res = await fetch(`/api/produits/${produit.id}/archive`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ archive: !produit.archive }),
            });
            if (!res.ok) throw new Error("Erreur lors du changement de statut");
            await fetchProduits();
        } catch (error) {
            console.error(error);
        }
    };

    // ── Actions variantes ──
    const handleOpenVariantsPanel = async (produit: Produit) => {
        setProduitPourVariantes(produit);
        setIsVariantsPanelOpen(true);
        try {
            // ⚠️ Hypothèse : GET /api/variantes accepte ?produitId=xxx pour filtrer.
            // À corriger ici si la route réelle diffère (ex: /api/produits/[id]/variantes).
            const res = await fetch(`/api/variantes?produitId=${produit.id}`);
            if (!res.ok) throw new Error("Erreur lors du chargement des variantes");
            const data: Variante[] = await res.json();
            setVariantes(data);
        } catch (error) {
            console.error(error);
            setVariantes([]);
        }
    };

    const handleCloseVariantsPanel = () => {
        setIsVariantsPanelOpen(false);
        setProduitPourVariantes(null);
        setVariantes([]);
    };

    const handleAddVariant = async (data: { nomVariante: string; skuVariante: string }) => {
        if (!produitPourVariantes) return;
        const res = await fetch("/api/variantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, produitId: produitPourVariantes.id }),
        });
        if (!res.ok) throw new Error("Erreur lors de l'ajout de la variante");
        await handleOpenVariantsPanel(produitPourVariantes); // recharge la liste
    };

    const handleEditVariant = async (
        varianteId: string,
        data: { nomVariante: string; skuVariante: string }
    ) => {
        const res = await fetch(`/api/variantes/${varianteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erreur lors de la modification de la variante");
        if (produitPourVariantes) await handleOpenVariantsPanel(produitPourVariantes);
    };

    const handleDeleteVariant = async (varianteId: string) => {
        const res = await fetch(`/api/variantes/${varianteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Erreur lors de la suppression de la variante");
        if (produitPourVariantes) await handleOpenVariantsPanel(produitPourVariantes);
    };

    return (
        <div className="flex flex-col gap-6">
            <ProductsPageHeader onCreateClick={handleOpenCreateModal} />

            <LowStockBanner
                count={produitsEnStockBas.length}
                onFilterClick={() => setStatusFilter("actifs")}
            />

            <ProductsToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                view={view}
                onViewChange={setView}
            />

            {isLoading ? (
    <div className="text-center py-12 text-muted-foreground text-sm">
        Chargement des produits...
    </div>
) : (
    <>
        {view === "table" ? (
            <ProductsTable
                produits={produitsPage}
                onEdit={handleOpenEditModal}
                onManageVariants={handleOpenVariantsPanel}
                onArchiveToggle={handleArchiveToggle}
            />
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {produitsPage.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
                        Aucun produit trouvé
                    </div>
                ) : (
                    produitsPage.map((produit) => (
                        <ProductCard
                            key={produit.id}
                            produit={produit}
                            onEdit={handleOpenEditModal}
                            onManageVariants={handleOpenVariantsPanel}
                            onArchiveToggle={handleArchiveToggle}
                        />
                    ))
                )}
            </div>
        )}

        <ProductsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={produitsFiltres.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
        />
    </>
)}

            <ProductFormModal
                key={produitEnEdition?.id ?? "nouveau-produit"}
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                produit={produitEnEdition}
                categories={categories}
                onSubmit={handleSubmitProduit}
            />

            <VariantsPanel
                isOpen={isVariantsPanelOpen}
                onClose={handleCloseVariantsPanel}
                produit={produitPourVariantes}
                variantes={variantes}
                onAddVariant={handleAddVariant}
                onEditVariant={handleEditVariant}
                onDeleteVariant={handleDeleteVariant}
            />
        </div>
    );
}