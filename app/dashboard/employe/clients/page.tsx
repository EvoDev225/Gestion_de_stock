import { obtenirSessionServeur } from "@/lib/auth";
import { redirect } from "next/navigation";
import { listerClients } from "@/lib/services/client.service";
import { serialiserClients } from "@/lib/serializers/client";
import ClientsPageClient from "../../(admin)/clients/ClientsPageClient";


/**
 * Page employé listant les clients.
 * La protection par rôle est déjà assurée par le layout parent
 * `app/dashboard/employe/layout.tsx` (redirige si role !== "EMPLOYEE").
 */
export default async function PageClientsEmploye() {
  // 1. Récupération de la session serveur ; redirection vers /login si absente.
  const session = await obtenirSessionServeur();
  if (!session) {
    redirect("/login");
  }

  // 2. Chargement et sérialisation de la liste des clients.
  const clients = await listerClients();
  const clientsSerialises = serialiserClients(clients);

  // 3. Rendu de la page cliente. Le rôle est fixé à "EMPLOYEE" car le layout
  //    parent garantit déjà qu'un employé est le seul à pouvoir atteindre cette page.
  return <ClientsPageClient clients={clientsSerialises} role="EMPLOYEE" />;
}