import { obtenirSessionServeur } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listerJournalActivite } from "@/lib/services/journal-activite.service";
import { serialiserActivites } from "@/lib/serializers/journal";
import JournalPageClient from "@/components/admin/journal/JournalPageClient";

export default async function JournalPage() {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const activitesPrisma = await listerJournalActivite();
    const activitesSerialisees = serialiserActivites(activitesPrisma);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">
                Journal d'activité
            </h1>
            <JournalPageClient activitesInitiales={activitesSerialisees} />
        </div>
    );
}