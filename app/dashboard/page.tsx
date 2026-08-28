// app/dashboard/page.tsx
import { cookies, headers } from "next/headers";
import { StockValueCard } from "@/components/dashboard/StockValueCard";
import {VentesDuJourCard} from "@/components/dashboard/VentesDuJourCard";
import {WatchlistBar} from "@/components/dashboard/WatchlistBar";
import {CategoryBreakdownCard} from "@/components/dashboard/CategoryBreakdownCard";
import {CommandesEnAttenteCard} from "@/components/dashboard/CommandesEnAttenteCard";
import {RecentActivityCard} from "@/components/dashboard/RecentActivityCard";

async function obtenirStatistiquesDashboard() {
    const cookieStore = await cookies();
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocole = process.env.NODE_ENV === "production" ? "https" : "http";

    const reponse = await fetch(`${protocole}://${host}/api/statistiques/dashboard`, {
        headers: {
            cookie: cookieStore.toString(),
        },
        cache: "no-store", // Force la récupération des données fraîches à chaque chargement
    });

    if (!reponse.ok) {
        throw new Error(`Erreur HTTP: ${reponse.status}`);
    }

    return reponse.json();
}

export default async function DashboardPage() {
    let stats;

    try {
        stats = await obtenirStatistiquesDashboard();
    } catch (error) {
        console.error("Erreur lors du chargement du dashboard :", error);

        // UI de repli gracieuse en cas d'échec du fetch
        return (
            <div className="flex min-h-100 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                    Impossible de charger les statistiques pour le moment.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Ligne 1 : Valeurs clés */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StockValueCard valeurStock={stats.valeurStock} />
                <VentesDuJourCard
                    montantTotal={stats.ventesDuJour.montantTotal}
                    nombre={stats.ventesDuJour.nombre}
                />
            </div>

            {/* Ligne 2 : Watchlist */}
            <WatchlistBar produits={stats.produitsASurveiller || []} />

            {/* Ligne 3 : Détails et activité */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
                <CategoryBreakdownCard categories={stats.repartitionCategories || []} />
                <CommandesEnAttenteCard nombre={stats.commandesEnAttente || 0} />
                <RecentActivityCard resume={stats.activiteRecente || "Aucune activité récente à signaler."} />
            </div>
        </div>
    );
}