import { obtenirSessionServeur } from "@/lib/auth";
import { obtenirUtilisateurParId } from "@/lib/services/utilisateur.service";
import { redirect } from "next/navigation";
import { serialiserUtilisateur } from "@/lib/serializers/utilisateur";
import ParametresPageClient from "@/components/admin/parametres/ParametresPageClient";

export default async function ParametresPage() {
    const session = await obtenirSessionServeur();
    
    if (!session) {
        redirect("/login");
    }

    const utilisateurRaw = await obtenirUtilisateurParId(session.id);
    
    if (!utilisateurRaw) {
        redirect("/login");
    }

    const utilisateur = serialiserUtilisateur(utilisateurRaw);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
            <ParametresPageClient utilisateur={utilisateur} />
        </div>
    );
}