"use client";

import { useState, useMemo } from "react";
import type { Utilisateur, NouvelUtilisateurData } from "@/types/utilisateur";
import UtilisateursToolbar from "./UtilisateursToolbar";
import UtilisateurCard from "./UtilisateurCard";
import NouvelUtilisateurModal from "./NouvelUtilisateurModal";
import UtilisateursTable from "./UtilisateursTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";


interface UtilisateursPageClientProps {
    utilisateursInitiaux: Utilisateur[];
    utilisateurCourantId: string;
}

type RoleFiltre = "TOUS" | "ADMIN" | "EMPLOYEE";

export default function UtilisateursPageClient({
    utilisateursInitiaux,
    utilisateurCourantId,
}: UtilisateursPageClientProps) {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(utilisateursInitiaux);
    const [filtreRole, setFiltreRole] = useState<RoleFiltre>("TOUS");
    const [modalOuvert, setModalOuvert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erreurApi, setErreurApi] = useState<string | null>(null);

    const [utilisateurAConfirmer, setUtilisateurAConfirmer] = useState<Utilisateur | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const utilisateursFiltres = useMemo(() => {
        if (filtreRole === "TOUS") return utilisateurs;
        return utilisateurs.filter((u) => u.role === filtreRole);
    }, [utilisateurs, filtreRole]);

    const handleCreerUtilisateur = async (data: NouvelUtilisateurData) => {
        setIsSubmitting(true);
        setErreurApi(null);

        try {
            const response = await fetch("/api/utilisateurs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.error || "Une erreur est survenue lors de la création.");
            }

            const nouvelUtilisateur: Utilisateur = {
                id: result.id,
                nom: result.nom,
                email: result.email,
                role: result.role,
                actif: result.actif,
                dateCreation: new Date().toISOString(),
            };

            setUtilisateurs((prev) => [nouvelUtilisateur, ...prev]);
            setModalOuvert(false);
        } catch (error: any) {
            setErreurApi(error.message || "Erreur lors de la création de l'utilisateur.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmerDesactivation = async () => {
        if (!utilisateurAConfirmer) return;
        setIsConfirming(true);
        setErreurApi(null);

        try {
            const response = await fetch(`/api/utilisateurs/${utilisateurAConfirmer.id}`, {
                method: "DELETE",
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(result?.error || "Une erreur est survenue lors de la désactivation.");
            }

            setUtilisateurs((prev) =>
                prev.map((u) => (u.id === utilisateurAConfirmer.id ? { ...u, actif: false } : u))
            );
            setUtilisateurAConfirmer(null);
        } catch (error: any) {
            setErreurApi(error.message || "Erreur lors de la désactivation.");
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="space-y-6">
            {erreurApi && (
                <div className="rounded-md border border-border bg-card p-4">
                    <p className="text-sm font-medium text-destructive">{erreurApi}</p>
                </div>
            )}

            <UtilisateursToolbar
                filtreRole={filtreRole}
                onFiltreRoleChange={setFiltreRole}
                onNouvelUtilisateur={() => setModalOuvert(true)}
            />

            <div className="hidden md:block">
                <UtilisateursTable
                    utilisateurs={utilisateursFiltres}
                    utilisateurCourantId={utilisateurCourantId}
                    onDemanderDesactivation={setUtilisateurAConfirmer}
                />
            </div>

            <div className="md:hidden grid grid-cols-1 gap-4">
                {utilisateursFiltres.map((utilisateur) => (
                    <UtilisateurCard
                        key={utilisateur.id}
                        utilisateur={utilisateur}
                        utilisateurCourantId={utilisateurCourantId}
                        onDemanderDesactivation={setUtilisateurAConfirmer}
                    />
                ))}
                {utilisateursFiltres.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        Aucun utilisateur trouvé pour ce filtre.
                    </p>
                )}
            </div>

            <NouvelUtilisateurModal
                isOpen={modalOuvert}
                onClose={() => setModalOuvert(false)}
                onSubmit={handleCreerUtilisateur}
                isSubmitting={isSubmitting}
            />

            <ConfirmDialog
                isOpen={utilisateurAConfirmer !== null}
                title="Désactiver cet utilisateur ?"
                message={
                    utilisateurAConfirmer
                        ? `Le compte de ${utilisateurAConfirmer.nom} sera désactivé et ne pourra plus se connecter.`
                        : ""
                }
                confirmLabel="Désactiver"
                cancelLabel="Annuler"
                variant="danger "
                isConfirming={isConfirming}
                onConfirm={handleConfirmerDesactivation}
                onCancel={() => setUtilisateurAConfirmer(null)}
            />
        </div>
    );
}