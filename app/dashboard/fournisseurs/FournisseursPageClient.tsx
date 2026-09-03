"use client";

import { useMemo, useState } from "react";
import type { Fournisseur, FournisseurFormData } from "@/types/fournisseur";
import FournisseursToolbar from "@/components/admin/fournisseurs/FournisseursToolbar";
import FournisseursTable from "@/components/admin/fournisseurs/FournisseursTable";
import FournisseurCard from "@/components/admin/fournisseurs/FournisseurCard";
import FournisseurFormModal from "@/components/admin/fournisseurs/FournisseurFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface FournisseursPageClientProps {
    fournisseursInitiaux: Fournisseur[];
}

export default function FournisseursPageClient({
    fournisseursInitiaux,
}: FournisseursPageClientProps) {
    const [fournisseurs, setFournisseurs] =
        useState<Fournisseur[]>(fournisseursInitiaux);
    const [recherche, setRecherche] = useState("");
    const [vue, setVue] = useState<"table" | "grille">("table");
    const [modalOuvert, setModalOuvert] = useState(false);
    const [fournisseurAEditer, setFournisseurAEditer] =
        useState<Fournisseur | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fournisseurASupprimer, setFournisseurASupprimer] =
        useState<Fournisseur | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fournisseursFiltres = useMemo(() => {
        const terme = recherche.trim().toLowerCase();

        if (!terme) {
            return fournisseurs;
        }

        return fournisseurs.filter((fournisseur) =>
            fournisseur.nom.toLowerCase().includes(terme)
        );
    }, [fournisseurs, recherche]);

    const lireMessageErreur = async (response: Response) => {
        try {
            const data = await response.json();
            return data.message || data.error || "Une erreur est survenue.";
        } catch {
            return "Une erreur est survenue.";
        }
    };

    const handleOuvrirCreation = () => {
        setFournisseurAEditer(null);
        setModalOuvert(true);
    };

    const handleOuvrirEdition = (fournisseur: Fournisseur) => {
        setFournisseurAEditer(fournisseur);
        setModalOuvert(true);
    };

    const handleFermerModal = () => {
        setModalOuvert(false);
        setFournisseurAEditer(null);
    };

    const handleSubmitFormulaire = async (data: FournisseurFormData) => {
        setIsSubmitting(true);

        try {
            const isEdition = Boolean(fournisseurAEditer);
            const url = isEdition
                ? `/api/fournisseurs/${fournisseurAEditer?.id}`
                : "/api/fournisseurs";

            const response = await fetch(url, {
                method: isEdition ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nom: data.nom,
                    email: data.email || undefined,
                    telephone: data.telephone,
                    adresse: data.adresse,
                }),
            });

            if (!response.ok) {
                const message = await lireMessageErreur(response);
                alert(message);
                return;
            }

            const result = await response.json();
            const fournisseurSauvegarde: Fournisseur =
                result.fournisseur ?? result;

            setFournisseurs((prev) => {
                if (isEdition) {
                    return prev.map((fournisseur) =>
                        fournisseur.id === fournisseurSauvegarde.id
                            ? fournisseurSauvegarde
                            : fournisseur
                    );
                }

                return [fournisseurSauvegarde, ...prev];
            });

            handleFermerModal();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOuvrirSuppression = (fournisseur: Fournisseur) => {
        setFournisseurASupprimer(fournisseur);
    };

    const confirmSuppression = async () => {
        if (!fournisseurASupprimer) return;

        setIsDeleting(true);

        try {
            const response = await fetch(
                `/api/fournisseurs/${fournisseurASupprimer.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const message = await lireMessageErreur(response);
                alert(message);
                return;
            }

            setFournisseurs((prev) =>
                prev.filter(
                    (fournisseur) => fournisseur.id !== fournisseurASupprimer.id
                )
            );
        } finally {
            setIsDeleting(false);
            setFournisseurASupprimer(null);
        }
    };

    return (
        <div className="space-y-6">
            <FournisseursToolbar
                recherche={recherche}
                onRechercheChange={setRecherche}
                vue={vue}
                onVueChange={setVue}
                onNouveauFournisseur={handleOuvrirCreation}
            />

            {vue === "table" ? (
                <FournisseursTable
                    fournisseurs={fournisseursFiltres}
                    onEdit={handleOuvrirEdition}
                    onDelete={handleOuvrirSuppression}
                />
            ) : fournisseursFiltres.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {fournisseursFiltres.map((fournisseur) => (
                        <FournisseurCard
                            key={fournisseur.id}
                            fournisseur={fournisseur}
                            onEdit={handleOuvrirEdition}
                            onDelete={handleOuvrirSuppression}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
                    Aucun fournisseur trouvé
                </div>
            )}

            <FournisseurFormModal
                key={fournisseurAEditer?.id ?? "nouveau"}
                isOpen={modalOuvert}
                onClose={handleFermerModal}
                onSubmit={handleSubmitFormulaire}
                fournisseurAEditer={fournisseurAEditer}
                isSubmitting={isSubmitting}
            />

            <ConfirmDialog
                isOpen={Boolean(fournisseurASupprimer)}
                onClose={() => setFournisseurASupprimer(null)}
                onConfirm={confirmSuppression}
                title="Supprimer le fournisseur"
                description={`Êtes-vous sûr de vouloir supprimer le fournisseur "${fournisseurASupprimer?.nom ?? ""}" ? Cette action est irréversible.`}
                variant="danger"
                isConfirming={isDeleting}
            />
        </div>
    );
}