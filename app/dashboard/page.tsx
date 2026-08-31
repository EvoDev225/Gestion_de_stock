// app/dashboard/page.tsx
import { cookies, headers } from "next/headers";

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
            
        </div>
    );
}