"use client";

import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import type { Vente } from "@/types/vente";
import type { CommandeFournisseur } from "@/types/commande-fournisseur";
import type { Lot } from "@/types/lot";

type TypeRetour = "CLIENT" | "FOURNISSEUR";

interface LigneSelection {
    cle: string;
    produitNom: string;
    varianteNom?: string;
    quantiteMax: number;
    quantite: number;
    ligneVenteId?: string;
    lotId?: string;
}

interface RetourFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        typeRetour: TypeRetour;
        venteId?: string;
        commandeFournisseurId?: string;
        motif?: string;
        lignes: { ligneVenteId?: string; lotId?: string; quantite: number }[];
    }) => Promise<void>;
}

export default function RetourFormModal({ isOpen, onClose, onSubmit }: RetourFormModalProps) {
    const [typeRetour, setTypeRetour] = useState<TypeRetour>("CLIENT");
    const [motif, setMotif] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [ventes, setVentes] = useState<Vente[]>([]);
    const [venteId, setVenteId] = useState("");
    const [venteDetail, setVenteDetail] = useState<Vente | null>(null);
    const [isLoadingVente, setIsLoadingVente] = useState(false);

    const [commandes, setCommandes] = useState<CommandeFournisseur[]>([]);
    const [commandeId, setCommandeId] = useState("");
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoadingLots, setIsLoadingLots] = useState(false);

    const [quantites, setQuantites] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!isOpen) return;
        setTypeRetour("CLIENT");
        setMotif("");
        setVenteId("");
        setVenteDetail(null);
        setCommandeId("");
        setLots([]);
        setQuantites({});

        fetch("/api/ventes")
            .then((res) => (res.ok ? res.json() : []))
            .then((data: Vente[]) => setVentes(data.filter((v) => v.statut === "VALIDEE")))
            .catch(() => setVentes([]));

        fetch("/api/commandes-fournisseur")
            .then((res) => (res.ok ? res.json() : []))
            .then((data: CommandeFournisseur[]) =>
                setCommandes(data.filter((c) => c.statut === "RECUE" || c.statut === "RECUE_PARTIELLE"))
            )
            .catch(() => setCommandes([]));
    }, [isOpen]);

    useEffect(() => {
        if (!venteId) {
            setVenteDetail(null);
            return;
        }
        setIsLoadingVente(true);
        setQuantites({});
        fetch(`/api/ventes/${venteId}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data: Vente | null) => setVenteDetail(data))
            .catch(() => setVenteDetail(null))
            .finally(() => setIsLoadingVente(false));
    }, [venteId]);

    useEffect(() => {
        if (!commandeId) {
            setLots([]);
            return;
        }
        setIsLoadingLots(true);
        setQuantites({});
        fetch(`/api/lots?commandeFournisseurId=${commandeId}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data: Lot[]) => setLots(data))
            .catch(() => setLots([]))
            .finally(() => setIsLoadingLots(false));
    }, [commandeId]);

    const lignesClient: LigneSelection[] = useMemo(() => {
        if (!venteDetail) return [];
        return venteDetail.ligneVentes.map((ligne) => ({
            cle: ligne.id,
            produitNom: ligne.produit.nom,
            varianteNom: ligne.variante?.nomVariante,
            quantiteMax: ligne.quantite,
            quantite: quantites[ligne.id] ?? 0,
            ligneVenteId: ligne.id,
        }));
    }, [venteDetail, quantites]);

    const lignesFournisseur: LigneSelection[] = useMemo(() => {
        return lots.map((lot) => ({
            cle: lot.id,
            produitNom: lot.produit?.nom ?? lot.variante?.produit?.nom ?? "—",
            varianteNom: lot.variante?.nomVariante,
            quantiteMax: lot.quantite,
            quantite: quantites[lot.id] ?? 0,
            lotId: lot.id,
        }));
    }, [lots, quantites]);

    if (!isOpen) return null;

    const lignesActives = typeRetour === "CLIENT" ? lignesClient : lignesFournisseur;
    const lignesAvecQuantite = lignesActives.filter((l) => l.quantite > 0);

    const peutSoumettre =
        !isSubmitting &&
        lignesAvecQuantite.length > 0 &&
        (typeRetour === "CLIENT" ? Boolean(venteId) : Boolean(commandeId));

    const handleQuantiteChange = (cle: string, valeur: number, max: number) => {
        const bornee = Math.max(0, Math.min(valeur, max));
        setQuantites((prev) => ({ ...prev, [cle]: bornee }));
    };

    const handleSubmit = async () => {
        if (!peutSoumettre) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                typeRetour,
                venteId: typeRetour === "CLIENT" ? venteId : undefined,
                commandeFournisseurId: typeRetour === "FOURNISSEUR" ? commandeId : undefined,
                motif: motif.trim() || undefined,
                lignes: lignesAvecQuantite.map((l) =>
                    typeRetour === "CLIENT"
                        ? { ligneVenteId: l.ligneVenteId!, quantite: l.quantite }
                        : { lotId: l.lotId!, quantite: l.quantite }
                ),
            });
            onClose();
        } catch (error) {
            console.error("Erreur lors de la soumission du retour :", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex justify-end"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-xl bg-card h-full shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-border flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">Nouveau retour</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setTypeRetour("CLIENT")}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                typeRetour === "CLIENT"
                                    ? "bg-primary text-white border-primary"
                                    : "border-border text-foreground hover:bg-muted"
                            }`}
                        >
                            Retour client
                        </button>
                        <button
                            type="button"
                            onClick={() => setTypeRetour("FOURNISSEUR")}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                typeRetour === "FOURNISSEUR"
                                    ? "bg-primary text-white border-primary"
                                    : "border-border text-foreground hover:bg-muted"
                            }`}
                        >
                            Retour fournisseur
                        </button>
                    </div>

                    {typeRetour === "CLIENT" ? (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="vente" className="text-sm font-medium text-foreground">
                                Vente
                            </label>
                            <select
                                id="vente"
                                value={venteId}
                                onChange={(e) => setVenteId(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Sélectionner une vente</option>
                                {ventes.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        Vente #{v.id.slice(0, 8)} — {new Date(v.dateVente).toLocaleDateString("fr-FR")}
                                        {v.client ? ` — ${v.client.nom}` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="commande" className="text-sm font-medium text-foreground">
                                Commande fournisseur
                            </label>
                            <select
                                id="commande"
                                value={commandeId}
                                onChange={(e) => setCommandeId(e.target.value)}
                                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Sélectionner une commande</option>
                                {commandes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.fournisseur.nom} — {new Date(c.dateCommande).toLocaleDateString("fr-FR")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(isLoadingVente || isLoadingLots) && (
                        <div className="text-center py-6 text-muted-foreground text-sm">Chargement...</div>
                    )}

                    {!isLoadingVente && !isLoadingLots && lignesActives.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="text-sm font-medium text-foreground">Articles à retourner</span>
                            {lignesActives.map((ligne) => (
                                <div
                                    key={ligne.cle}
                                    className="flex items-center justify-between gap-4 border border-border rounded-lg p-3"
                                >
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-foreground truncate">
                                            {ligne.produitNom}
                                            {ligne.varianteNom ? ` — ${ligne.varianteNom}` : ""}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Disponible : {ligne.quantiteMax}
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        min={0}
                                        max={ligne.quantiteMax}
                                        value={ligne.quantite}
                                        onChange={(e) =>
                                            handleQuantiteChange(ligne.cle, Number(e.target.value), ligne.quantiteMax)
                                        }
                                        className="w-20 rounded-lg border border-border bg-card px-2 py-1.5 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoadingVente && typeRetour === "CLIENT" && venteId && lignesActives.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                            Aucune ligne disponible sur cette vente
                        </div>
                    )}
                    {!isLoadingLots && typeRetour === "FOURNISSEUR" && commandeId && lignesActives.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                            Aucun lot disponible pour cette commande
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="motif" className="text-sm font-medium text-foreground">
                            Motif (optionnel)
                        </label>
                        <textarea
                            id="motif"
                            rows={3}
                            value={motif}
                            onChange={(e) => setMotif(e.target.value)}
                            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-border flex justify-end gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!peutSoumettre}
                        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}