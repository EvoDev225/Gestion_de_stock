"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import type { Vente } from "@/types/vente"
import VentesPageHeader from "@/components/ventes/VentesPageHeader"
import VentesToolbar from "@/components/ventes/VentesToolbar"
import VentesTable from "@/components/ventes/VentesTable"
import VentesPagination from "@/components/ventes/VentesPagination"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import NouvelleVenteModal from "@/components/ventes/NouvelleVenteModal"
import VenteDetailModal from "@/components/ventes/VenteDetailModal"

const ITEMS_PER_PAGE = 10

export default function VentesPageClient() {
    const [ventes, setVentes] = useState<Vente[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [searchValue, setSearchValue] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<"tous" | "validees" | "annulees">("tous")
    const [modePaiementFilter, setModePaiementFilter] = useState<"tous" | "TOTAL" | "CREDIT">("tous")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [isNouvelleVenteModalOpen, setIsNouvelleVenteModalOpen] = useState<boolean>(false)
    const [venteACanceling, setVenteACanceling] = useState<Vente | null>(null)
    const [isConfirmingCancel, setIsConfirmingCancel] = useState<boolean>(false)
    const [venteEnDetail, setVenteEnDetail] = useState<Vente | null>(null)

    const fetchVentes = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/ventes")
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des ventes")
            }
            const data: Vente[] = await response.json()
            setVentes(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchVentes()
    }, [fetchVentes])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, statusFilter, modePaiementFilter])

    const filteredVentes = useMemo(() => {
        return ventes.filter((vente) => {
            const matchesSearch =
                searchValue.trim() === "" ||
                (vente.client?.nom && vente.client.nom.toLowerCase().includes(searchValue.toLowerCase())) ||
                (vente.utilisateur?.nom && vente.utilisateur.nom.toLowerCase().includes(searchValue.toLowerCase()))

            let matchesStatus = true
            if (statusFilter === "validees") {
                matchesStatus = vente.statut === "VALIDEE"
            } else if (statusFilter === "annulees") {
                matchesStatus = vente.statut === "ANNULEE"
            }

            let matchesModePaiement = true
            if (modePaiementFilter !== "tous") {
                matchesModePaiement = vente.modePaiement === modePaiementFilter
            }

            return matchesSearch && matchesStatus && matchesModePaiement
        })
    }, [ventes, searchValue, statusFilter, modePaiementFilter])

    const totalPages = Math.ceil(filteredVentes.length / ITEMS_PER_PAGE) || 1

    const paginatedVentes = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE
        return filteredVentes.slice(start, start + ITEMS_PER_PAGE)
    }, [filteredVentes, currentPage])

    const handleOpenCreateModal = () => {
        setIsNouvelleVenteModalOpen(true)
    }

    const handleCloseCreateModal = () => {
        setIsNouvelleVenteModalOpen(false)
    }

    const handleVenteCreated = () => {
        setIsNouvelleVenteModalOpen(false)
        fetchVentes()
    }

    const handleRequestCancel = (vente: Vente) => {
        setVenteACanceling(vente)
    }

    const handleCloseCancelDialog = () => {
        if (isConfirmingCancel) return
        setVenteACanceling(null)
    }

    const handleConfirmCancel = async () => {
        if (!venteACanceling) return

        try {
            setIsConfirmingCancel(true)
            const response = await fetch(`/api/ventes/${venteACanceling.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ statut: "ANNULEE" }),
            })

            if (!response.ok) {
                throw new Error("Erreur lors de l'annulation de la vente")
            }

            setVenteACanceling(null)
            fetchVentes()
        } catch (error) {
            console.error(error)
        } finally {
            setIsConfirmingCancel(false)
        }
    }

    const handleRowClick = (vente: Vente) => {
        setVenteEnDetail(vente)
    }

    const handleCloseDetail = () => {
        setVenteEnDetail(null)
    }

    return (
        <div className="space-y-6 bg-background text-foreground min-h-screen p-6">
            <VentesPageHeader onCreateClick={handleOpenCreateModal} />

            <VentesToolbar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                modePaiementFilter={modePaiementFilter}
                onModePaiementChange={setModePaiementFilter}
            />

            {isLoading ? (
                <div className="flex justify-center items-center py-12 text-muted-foreground">
                    Chargement des ventes...
                </div>
            ) : (
                <>
                    <VentesTable
                        ventes={paginatedVentes}
                        onRequestCancel={handleRequestCancel}
                        onRowClick={handleRowClick}
                    />
                    <VentesPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredVentes.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}

            <ConfirmDialog
                isOpen={venteACanceling !== null}
                title="Annuler la vente"
                message={
                    venteACanceling?.client?.nom
                        ? `Êtes-vous sûr de vouloir annuler la vente pour le client ${venteACanceling.client.nom} ?`
                        : "Êtes-vous sûr de vouloir annuler cette vente ?"
                }
                variant="danger"
                confirmLabel="Annuler la vente"
                cancelLabel="Retour"
                isConfirming={isConfirmingCancel}
                onConfirm={handleConfirmCancel}
                onCancel={handleCloseCancelDialog}
            />

            <NouvelleVenteModal
                isOpen={isNouvelleVenteModalOpen}
                onClose={handleCloseCreateModal}
                onVenteCreated={handleVenteCreated}
            />

            <VenteDetailModal
                isOpen={venteEnDetail !== null}
                vente={venteEnDetail}
                onClose={handleCloseDetail}
            />
        </div>
    )
}