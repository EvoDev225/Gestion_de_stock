"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import ReceptionsTable from "./ReceptionsTable";
import ReceptionCard from "./ReceptionCard";
import type { ReceptionFournisseur } from "@/types/reception-fournisseur";

interface ReceptionsPageClientProps {
    receptions: ReceptionFournisseur[];
}

type FiltreStatut = "TOUS" | "RECUE" | "RECUE_PARTIELLE";

export default function ReceptionsPageClient({ receptions }: ReceptionsPageClientProps) {
    const [recherche, setRecherche] = useState("");
    const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>("TOUS");

    const receptionsFiltrees = useMemo(() => {
        return receptions.filter((reception) => {
            const nomFournisseur = reception.commandeFournisseur?.fournisseur.nom ?? "";
            const correspondRecherche = nomFournisseur
                .toLowerCase()
                .includes(recherche.toLowerCase());

            const statutCommande = reception.commandeFournisseur?.statut;
            const correspondStatut = filtreStatut === "TOUS" || statutCommande === filtreStatut;

            return correspondRecherche && correspondStatut;
        });
    }, [receptions, recherche, filtreStatut]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Réceptions fournisseur</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Historique des marchandises reçues sur les commandes fournisseurs.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        placeholder="Rechercher par fournisseur..."
                        className="w-full pl-9 pr-3 py-2 rounded-md bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                <select
                    value={filtreStatut}
                    onChange={(e) => setFiltreStatut(e.target.value as FiltreStatut)}
                    className="px-3 py-2 rounded-md bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="TOUS">Tous les statuts</option>
                    <option value="RECUE">Reçue</option>
                    <option value="RECUE_PARTIELLE">Reçue partiellement</option>
                </select>
            </div>

            <div className="hidden md:block">
                <ReceptionsTable receptions={receptionsFiltrees} />
            </div>

            <div className="md:hidden grid grid-cols-1 gap-4">
                {receptionsFiltrees.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Aucune réception ne correspond à votre recherche.
                    </p>
                ) : (
                    receptionsFiltrees.map((reception) => (
                        <ReceptionCard key={reception.id} reception={reception} />
                    ))
                )}
            </div>
        </div>
    );
}