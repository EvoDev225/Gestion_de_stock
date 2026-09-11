"use client";

import { useMemo, useState } from "react";
import type { Activite } from "@/types/journal";
import JournalToolbar from "./JournalToolbar";
import JournalTable from "./JournalTable";
import JournalCard from "./JournalCard";
import RetoursPagination from "@/components/admin/retours/RetoursPagination";

interface JournalPageClientProps {
    activitesInitiales: Activite[];
}

const TAILLE_PAGE = 15;

/**
 * Composant orchestrateur du module Journal d'activité.
 * Gère les filtres combinés, la pagination côté client et l'affichage responsive.
 */
export default function JournalPageClient({
    activitesInitiales,
}: JournalPageClientProps) {
    const [activites] = useState<Activite[]>(activitesInitiales);
    const [filtreAction, setFiltreAction] = useState<string>("");
    const [filtreUtilisateurId, setFiltreUtilisateurId] = useState<string>("");
    const [filtreDateDebut, setFiltreDateDebut] = useState<string>("");
    const [filtreDateFin, setFiltreDateFin] = useState<string>("");
    const [pageActuelle, setPageActuelle] = useState<number>(1);

    // Liste triée des actions distinctes disponibles pour le filtre
    const actionsDisponibles = useMemo(() => {
        return Array.from(new Set(activites.map((a) => a.action))).sort();
    }, [activites]);

    // Liste dédupliquée et triée des utilisateurs pour le filtre
    const utilisateursDisponibles = useMemo(() => {
        const mapUtilisateurs = new Map<string, { id: string; nom: string }>();
        
        activites.forEach((activite) => {
            if (!mapUtilisateurs.has(activite.utilisateurId)) {
                mapUtilisateurs.set(activite.utilisateurId, {
                    id: activite.utilisateurId,
                    nom: activite.utilisateur.nom,
                });
            }
        });

        return Array.from(mapUtilisateurs.values()).sort((a, b) =>
            a.nom.localeCompare(b.nom),
        );
    }, [activites]);

    // Filtrage séquentiel des activités selon les 4 critères
    const activitesFiltrees = useMemo(() => {
        let resultat = activites;

        if (filtreAction !== "") {
            resultat = resultat.filter((a) => a.action === filtreAction);
        }

        if (filtreUtilisateurId !== "") {
            resultat = resultat.filter(
                (a) => a.utilisateurId === filtreUtilisateurId,
            );
        }

        if (filtreDateDebut !== "") {
            const dateDebutObjet = new Date(filtreDateDebut);
            resultat = resultat.filter(
                (a) => new Date(a.dateAction) >= dateDebutObjet,
            );
        }

        if (filtreDateFin !== "") {
            const dateFinObjet = new Date(filtreDateFin + "T23:59:59");
            resultat = resultat.filter(
                (a) => new Date(a.dateAction) <= dateFinObjet,
            );
        }

        return resultat;
    }, [activites, filtreAction, filtreUtilisateurId, filtreDateDebut, filtreDateFin]);

    // Nombre total de pages après filtrage
    const nombrePages = useMemo(() => {
        return Math.max(1, Math.ceil(activitesFiltrees.length / TAILLE_PAGE));
    }, [activitesFiltrees.length]);

    // Activités de la page courante
    const activitesPaginees = useMemo(() => {
        const indexDebut = (pageActuelle - 1) * TAILLE_PAGE;
        const indexFin = pageActuelle * TAILLE_PAGE;
        return activitesFiltrees.slice(indexDebut, indexFin);
    }, [activitesFiltrees, pageActuelle]);

    // Handlers de changement de filtre avec reset de la page à 1
    const gererChangementAction = (valeur: string) => {
        setFiltreAction(valeur);
        setPageActuelle(1);
    };

    const gererChangementUtilisateurId = (valeur: string) => {
        setFiltreUtilisateurId(valeur);
        setPageActuelle(1);
    };

    const gererChangementDateDebut = (valeur: string) => {
        setFiltreDateDebut(valeur);
        setPageActuelle(1);
    };

    const gererChangementDateFin = (valeur: string) => {
        setFiltreDateFin(valeur);
        setPageActuelle(1);
    };

    const gestionnaireReinitialiser = () => {
        setFiltreAction("");
        setFiltreUtilisateurId("");
        setFiltreDateDebut("");
        setFiltreDateFin("");
        setPageActuelle(1);
    };

    return (
        <div className="space-y-6">
            {/* Barre de filtres combinés */}
            <JournalToolbar
                actionsDisponibles={actionsDisponibles}
                utilisateursDisponibles={utilisateursDisponibles}
                filtreAction={filtreAction}
                filtreUtilisateurId={filtreUtilisateurId}
                filtreDateDebut={filtreDateDebut}
                filtreDateFin={filtreDateFin}
                onFiltreActionChange={gererChangementAction}
                onFiltreUtilisateurIdChange={gererChangementUtilisateurId}
                onFiltreDateDebutChange={gererChangementDateDebut}
                onFiltreDateFinChange={gererChangementDateFin}
                onReinitialiser={gestionnaireReinitialiser}
                nombreResultats={activitesFiltrees.length}
            />

            {/* Affichage tableau pour desktop */}
            <div className="hidden md:block">
                <JournalTable activites={activitesPaginees} />
            </div>

            {/* Affichage cartes pour mobile */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {activitesFiltrees.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        Aucune activité trouvée pour ce filtre.
                    </p>
                ) : (
                    activitesPaginees.map((activite) => (
                        <JournalCard key={activite.id} activite={activite} />
                    ))
                )}
            </div>

            {/* Pagination */}
            <RetoursPagination
                pageActuelle={pageActuelle}
                nombrePages={nombrePages}
                onPageChange={setPageActuelle}
            />
        </div>
    );
}