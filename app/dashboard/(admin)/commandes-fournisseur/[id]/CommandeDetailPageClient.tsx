// app/dashboard/commandes-fournisseur/[id]/CommandeDetailPageClient.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CommandeFournisseur, NouvelleLigneCommandeData, Produit } from "@/types/commande-fournisseur";
import LignesCommandeTable from "@/components/admin/commandes-fournisseur/LignesCommandeTable";
import AjouterLigneModal from "@/components/admin/commandes-fournisseur/AjouterLigneModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const statutConfig = {
    EN_ATTENTE: { label: "En attente", classes: "bg-muted text-muted-foreground" },
    ENVOYEE: { label: "Envoyée", classes: "bg-accent-subtle text-accent-hover" },
    RECUE_PARTIELLE: { label: "Reçue partielle", classes: "bg-warning/10 text-warning" },
    RECUE: { label: "Reçue", classes: "bg-primary/10 text-primary" },
} as const;

function formatDate(dateString: string): string {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(dateString));
}

interface CommandeDetailPageClientProps {
    commandeInitiale: CommandeFournisseur;
    produits: Produit[];
}

export default function CommandeDetailPageClient({
    commandeInitiale,
    produits,
}: CommandeDetailPageClientProps) {
    const router = useRouter();
    const [commande, setCommande] = useState<CommandeFournisseur>(commandeInitiale);
    const [modalLigneOuvert, setModalLigneOuvert] = useState(false);
    const [isSubmittingLigne, setIsSubmittingLigne] = useState(false);
    const [isModifiantLigneId, setIsModifiantLigneId] = useState<string | null>(null);
    const [ligneASupprimer, setLigneASupprimer] = useState<string | null>(null);
    const [isSuppressionCommandeOuverte, setIsSuppressionCommandeOuverte] = useState(false);
    const [isChangeantStatut, setIsChangeantStatut] = useState(false);
    const [erreurApi, setErreurApi] = useState<string | null>(null);
    const [isSupprimantLigne, setIsSupprimantLigne] = useState(false);
    const [isSupprimantCommande, setIsSupprimantCommande] = useState(false);

    const modifiable = useMemo(() => commande.statut === "EN_ATTENTE", [commande.statut]);
    const statut = statutConfig[commande.statut];

    const handleAjouterLigne = async (data: NouvelleLigneCommandeData) => {
        setIsSubmittingLigne(true);
        setErreurApi(null);
        try {
            const res = await fetch(`/api/commandes-fournisseur/${commande.id}/lignes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || result.message || "Erreur lors de l'ajout.");

            setCommande((prev) => ({
                ...prev,
                ligneCommandeFournisseur: [...prev.ligneCommandeFournisseur, result],
            }));
            setModalLigneOuvert(false);
        } catch (error: any) {
            setErreurApi(error.message);
            throw error;
        } finally {
            setIsSubmittingLigne(false);
        }
    };

    const handleModifierLigne = async (ligneId: string, data: { quantiteCommande?: number; prixAchatUnitaire?: number }) => {
        setIsModifiantLigneId(ligneId);
        setErreurApi(null);
        try {
            const res = await fetch(`/api/commandes-fournisseur/${commande.id}/lignes/${ligneId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || result.message || "Erreur lors de la modification.");

            setCommande((prev) => ({
                ...prev,
                ligneCommandeFournisseur: prev.ligneCommandeFournisseur.map((l) => (l.id === ligneId ? result : l)),
            }));
        } catch (error: any) {
            setErreurApi(error.message);
        } finally {
            setIsModifiantLigneId(null);
        }
    };

    const handleSupprimerLigne = (ligneId: string) => setLigneASupprimer(ligneId);

    const confirmSupprimerLigne = async () => {
        if (!ligneASupprimer) return;
        setIsSupprimantLigne(true);
        setErreurApi(null);
        try {
            const res = await fetch(`/api/commandes-fournisseur/${commande.id}/lignes/${ligneASupprimer}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const result = await res.json();
                if (res.status === 400) {
                    setErreurApi(result.error || result.message || "Impossible de supprimer la dernière ligne.");
                    setLigneASupprimer(null);
                    return;
                }
                throw new Error(result.error || result.message || "Erreur lors de la suppression.");
            }

            setCommande((prev) => ({
                ...prev,
                ligneCommandeFournisseur: prev.ligneCommandeFournisseur.filter((l) => l.id !== ligneASupprimer),
            }));
            setLigneASupprimer(null);
        } catch (error: any) {
            setErreurApi(error.message);
            setLigneASupprimer(null);
        } finally {
            setIsSupprimantLigne(false);
        }
    };

    const handleChangerStatut = async (nouveauStatut: "EN_ATTENTE" | "ENVOYEE") => {
        setIsChangeantStatut(true);
        setErreurApi(null);
        try {
            const res = await fetch(`/api/commandes-fournisseur/${commande.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ statut: nouveauStatut }),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || result.message || "Erreur lors du changement de statut.");

            setCommande((prev) => ({ ...prev, statut: nouveauStatut }));
        } catch (error: any) {
            setErreurApi(error.message);
        } finally {
            setIsChangeantStatut(false);
        }
    };

    const confirmSupprimerCommande = async () => {
        setIsSupprimantCommande(true);
        setErreurApi(null);
        try {
            const res = await fetch(`/api/commandes-fournisseur/${commande.id}`, { method: "DELETE" });
            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || result.message || "Erreur lors de la suppression de la commande.");
            }
            router.push("/dashboard/commandes-fournisseur");
        } catch (error: any) {
            setErreurApi(error.message);
            setIsSuppressionCommandeOuverte(false);
        } finally {
            setIsSupprimantCommande(false);
        }
    };

    return (
        <div className="space-y-6">
            <Link
                href="/dashboard/commandes-fournisseur"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Retour aux commandes
            </Link>

            {erreurApi && (
                <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                    <p className="text-sm font-medium text-destructive">{erreurApi}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Commande du {formatDate(commande.dateCommande)}</h1>
                    <p className="text-muted-foreground mt-1">Fournisseur : {commande.fournisseur.nom}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statut.classes}`}>
                        {statut.label}
                    </span>
                    {modifiable && (
                        <>
                            <button
                                onClick={() => handleChangerStatut("ENVOYEE")}
                                disabled={isChangeantStatut}
                                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isChangeantStatut ? "Envoi..." : "Passer à ENVOYEE"}
                            </button>
                            <button
                                onClick={() => setIsSuppressionCommandeOuverte(true)}
                                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90"
                            >
                                Supprimer la commande
                            </button>
                        </>
                    )}
                </div>
            </div>

            <LignesCommandeTable
                lignes={commande.ligneCommandeFournisseur}
                modifiable={modifiable}
                onModifierLigne={handleModifierLigne}
                onSupprimerLigne={handleSupprimerLigne}
                isModifiantLigneId={isModifiantLigneId}
            />

            {modifiable && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setModalLigneOuvert(true)}
                        className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90"
                    >
                        Ajouter une ligne
                    </button>
                </div>
            )}

            <AjouterLigneModal
                isOpen={modalLigneOuvert}
                onClose={() => setModalLigneOuvert(false)}
                onSubmit={handleAjouterLigne}
                produits={produits}
                isSubmitting={isSubmittingLigne}
            />

            <ConfirmDialog
                isOpen={ligneASupprimer !== null}
                onClose={() => setLigneASupprimer(null)}
                onConfirm={confirmSupprimerLigne}
                title="Supprimer la ligne"
                description="Êtes-vous sûr de vouloir supprimer cette ligne de la commande ?"
                variant="danger"
                isConfirming={isSupprimantLigne}
            />

            <ConfirmDialog
                isOpen={isSuppressionCommandeOuverte}
                onClose={() => setIsSuppressionCommandeOuverte(false)}
                onConfirm={confirmSupprimerCommande}
                title="Supprimer la commande"
                description="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
                variant="danger"
                isConfirming={isSupprimantCommande}
            />
        </div>
    );
}