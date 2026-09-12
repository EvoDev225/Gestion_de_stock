import { obtenirSessionServeur } from "@/lib/auth";
import { listerUtilisateurs } from "@/lib/services/utilisateur.service";
import { redirect } from "next/navigation";
import UtilisateursPageClient from "@/components/admin/utilisateurs/UtilisateursPageClient";
import { serialiserUtilisateurs } from "@/lib/serializers/utilisateur";

export default async function UtilisateursPage() {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const utilisateursRaw = await listerUtilisateurs();
    const utilisateurs = serialiserUtilisateurs(utilisateursRaw);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
            <UtilisateursPageClient
                utilisateursInitiaux={utilisateurs}
                utilisateurCourantId={session.id}
            />
        </div>
    );
}