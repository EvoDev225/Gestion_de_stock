"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InventaireDetailHeader from "@/components/inventaires/InventaireDetailHeader";
import LignesInventaireTable from "@/components/inventaires/LignesInventaireTable";
import LigneInventaireCard from "@/components/inventaires/LigneInventaireCard";
import AjouterLigneModal from "@/components/inventaires/AjouterLigneModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Inventaire, LigneInventaire } from "@/types/inventaire";
import type { Produit } from "@/types/produit";

interface InventaireDetailPageClientProps {
    inventaireId: string;
    role: "ADMIN" | "EMPLOYEE";
}

export default function InventaireDetailPageClient({
    inventaireId,
    role,
}: InventaireDetailPageClientProps) {
    const router = useRouter();

    const [inventaire, setInventaire] = useState<Inventaire | null>(null);
    const [produits, setProduits] = useState<Produit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Saisies en attente (non encore envoyées au backend) : ligneId -> { quantitePhysique, justification }
    const [saisies, setSaisies] = useState<Record<string, { quantitePhysique: number; justification: string }>>({});

    const [isAddLigneModalOpen, setIsAddLigneModalOpen] = useState(false);
    const [isValidateDialogOpen, setIsValidateDialogOpen] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // ── Chargement ──
    const fetchInventaire = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/inventaires/${inventaireId}`);
            if (!res.ok) throw new Error("Erreur lors du chargement de l'inventaire");
            const data: Inventaire = await res.json();
            setInventaire(data);

            // Initialise les saisies locales à partir des valeurs déjà en base
            const initial: Record<string, { quantitePhysique: number; justification: string }> = {};
            data.lignesInventaire.forEach((ligne) => {
                initial[ligne.id] = {
                    quantitePhysique: ligne.quantitePhysique,
                    justification: ligne.justification ?? "",
                };
            });
            setSaisies(initial);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [inventaireId]);

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
        fetchInventaire();
        fetchProduits();
    }, [fetchInventaire, fetchProduits]);

    const isEditable = inventaire?.statut === "EN_COURS";
    const canValidate = role === "ADMIN" && isEditable;

    // ── Édition locale des lignes (pas d'appel API à chaque frappe) ──
    const handleQuantitePhysiqueChange = (ligneId: string, valeur: number) => {
        setSaisies((prev) => ({
            ...prev,
            [ligneId]: { ...prev[ligneId], quantitePhysique: valeur },
        }));
    };

    const handleJustificationChange = (ligneId: string, valeur: string) => {
        setSaisies((prev) => ({
            ...prev,
            [ligneId]: { ...prev[ligneId], justification: valeur },
        }));
    };

    // Fusionne les lignes du serveur avec les saisies locales en cours, pour l'affichage
    const lignesAffichees: LigneInventaire[] = useMemo(() => {
        if (!inventaire) return [];
        return inventaire.lignesInventaire.map((ligne) => ({
            ...ligne,
            quantitePhysique: saisies[ligne.id]?.quantitePhysique ?? ligne.quantitePhysique,
            justification: saisies[ligne.id]?.justification ?? ligne.justification,
        }));
    }, [inventaire, saisies]);

    // ── Ajout de ligne ──
    const handleAddLigne = async (produitId: string, varianteId: string | null) => {
        setActionError(null);
        try {
            const res = await fetch(`/api/inventaires/${inventaireId}/lignes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ produitId, varianteId }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error ?? "Erreur lors de l'ajout de la ligne");
            }

            await fetchInventaire();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            setActionError(message);
            throw error;
        }
    };

    // ── Validation ──
    const handleConfirmValidate = async () => {
        if (!inventaire) return;

        setIsValidating(true);
        setActionError(null);
        try {
            const saisiesPourEnvoi = inventaire.lignesInventaire.map((ligne) => ({
                ligneInventaireId: ligne.id,
                quantitePhysique: saisies[ligne.id]?.quantitePhysique ?? ligne.quantitePhysique,
                justification: saisies[ligne.id]?.justification || undefined,
            }));

            const res = await fetch(`/api/inventaires/${inventaireId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ saisies: saisiesPourEnvoi }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({}));
                throw new Error(errorBody.error ?? "Erreur lors de la validation de l'inventaire");
            }

            await fetchInventaire();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            setActionError(message);
        } finally {
            setIsValidating(false);
            setIsValidateDialogOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                Chargement de l'inventaire...
            </div>
        );
    }

    if (!inventaire) {
        return (
            <div className="text-center py-12 text-muted-foreground text-sm">
                Inventaire introuvable.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <InventaireDetailHeader
                inventaire={inventaire}
                canValidate={canValidate}
                onValidateClick={() => setIsValidateDialogOpen(true)}
                onBackClick={() => router.push("/dashboard/inventaires")}
            />

            {isEditable && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setIsAddLigneModalOpen(true)}
                        className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        + Ajouter une ligne
                    </button>
                </div>
            )}

            <div className="hidden lg:block">
                <LignesInventaireTable
                    lignes={lignesAffichees}
                    editable={isEditable}
                    onQuantitePhysiqueChange={handleQuantitePhysiqueChange}
                    onJustificationChange={handleJustificationChange}
                />
            </div>

            <div className="flex flex-col gap-3 lg:hidden">
                {lignesAffichees.map((ligne) => (
                    <LigneInventaireCard
                        key={ligne.id}
                        ligne={ligne}
                        editable={isEditable}
                        onQuantitePhysiqueChange={handleQuantitePhysiqueChange}
                        onJustificationChange={handleJustificationChange}
                    />
                ))}
            </div>

            <AjouterLigneModal
                isOpen={isAddLigneModalOpen}
                onClose={() => setIsAddLigneModalOpen(false)}
                produits={produits}
                onSubmit={handleAddLigne}
            />

            <ConfirmDialog
    isOpen={isValidateDialogOpen}
    title="Valider cet inventaire ?"
    message="Cette action est irréversible. Les écarts constatés généreront des mouvements de stock d'ajustement définitifs."
    confirmLabel="Valider"
    isConfirming={isValidating}
    onConfirm={handleConfirmValidate}
    onCancel={() => setIsValidateDialogOpen(false)}
/>

            {actionError && (
                <div className="fixed bottom-6 right-6 max-w-sm rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-lg">
                    {actionError}
                </div>
            )}
        </div>
    );
}