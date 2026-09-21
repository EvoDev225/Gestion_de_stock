import { obtenirSessionServeur } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductsPageClient from "@/app/dashboard/(admin)/products/ProductsPageClient";

/**
 * Page employé pour la liste et la consultation des produits.
 * La protection par rôle est déjà assurée par le layout parent
 * `app/dashboard/employe/layout.tsx` (redirige si role !== "EMPLOYEE").
 */
export default async function EmployeeProductsPage() {
  // 1. Récupération de la session serveur ; redirection vers /login si absente.
  const session = await obtenirSessionServeur();
  if (!session) {
    redirect("/login");
  }

  // 2. Rendu de la page cliente avec le rôle fixé à "EMPLOYEE" pour activer
  //    le comportement en lecture seule (masquage des actions de modification).
  return <ProductsPageClient role="EMPLOYEE" />;
}