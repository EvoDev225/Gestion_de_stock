import { obtenirSessionServeur } from "@/lib/auth";
import { redirect } from "next/navigation";
import EmployeeVentesPageClient from "@/components/employe/EmployeeVentesPageClient";

/**
 * Page de gestion des ventes pour les employés.
 * Ce Server Component récupère la session pour transmettre l'ID de l'utilisateur
 * au composant client, qui filtrera ensuite les ventes en conséquence.
 */
export default async function EmployeeVentesPage() {
  // 1. Récupération de la session et filet de sécurité minimal
  const session = await obtenirSessionServeur();
  if (!session) {
    redirect("/login");
  }

  // 2. Rendu du composant client avec l'ID de l'utilisateur connecté
  return (
    <div className="space-y-6">
      <EmployeeVentesPageClient utilisateurId={session.id} />
    </div>
  );
}