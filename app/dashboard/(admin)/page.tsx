// app/dashboard/page.tsx
import { cookies, headers } from "next/headers";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import SalesChart from "@/components/admin/dashboard/SalesChart";
import PendingActions from "@/components/admin/dashboard/PendingActions";

interface StatistiquesDashboard {
    produitsEnStock: number;
    alertesRupture: number;
    ventesDuMois: number;
    commandesEnAttente: number;
}

interface PointEvolutionVente {
    date: string;
    montant: number;
}

interface ActionEnAttente {
    id: string;
    type: "inventaire" | "commande_retard" | "peremption";
    titre: string;
    description: string;
    href?: string;
}

interface ResumeDashboard {
    stats: StatistiquesDashboard;
    evolutionVentes: PointEvolutionVente[];
    actions: ActionEnAttente[];
}

async function obtenirResumeDashboard(): Promise<ResumeDashboard> {
    const cookieStore = await cookies();
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocole = process.env.NODE_ENV === "production" ? "https" : "http";

    const reponse = await fetch(`${protocole}://${host}/api/dashboard/summary`, {
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
    let resume: ResumeDashboard;

    try {
        resume = await obtenirResumeDashboard();
    } catch (error) {
        console.error("Erreur lors du chargement du dashboard :", error);

        return (
            <div className="flex min-h-100 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">
                    Impossible de charger les statistiques pour le moment.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* StatsCards gère déjà son propre grid + mb-10, pas de wrapper nécessaire */}
            <StatsCards stats={resume.stats} />

            {/* SalesChart (lg:col-span-2) et PendingActions (lg:col-span-1) attendent
                d'être placés directement dans un grid à 3 colonnes — ils portent déjà
                leur propre bg-card/ambient-shadow/rounded-[24px], ne pas les ré-envelopper */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SalesChart data={resume.evolutionVentes} />
                <PendingActions actions={resume.actions} />
            </div>
        </div>
    );
}