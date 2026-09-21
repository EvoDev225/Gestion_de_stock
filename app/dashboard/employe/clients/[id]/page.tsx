import { redirect, notFound } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import { obtenirClientParId } from "@/lib/services/client.service";
import { serialiserClientAvecVentes } from "@/lib/serializers/client";
import ClientDetailPageClient from "@/app/dashboard/(admin)/clients/ClientDetailPageClient";


/**
 * Page employé affichant le détail d'un client.
 * La protection par rôle est déjà assurée par le layout parent
 * `app/dashboard/employe/layout.tsx` (redirige si role !== "EMPLOYEE").
 */
export default async function PageDetailClientEmploye({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Récupération de la session serveur ; redirection vers /login si absente.
  const session = await obtenirSessionServeur();
  if (!session) {
    redirect("/login");
  }

  // 2. Extraction de l'identifiant depuis les paramètres dynamiques.
  const { id } = await params;

  // 3. Chargement du client par son identifiant ; page 404 si introuvable.
  let client;
  try {
    client = await obtenirClientParId(id);
  } catch {
    notFound();
  }

  // 4. Sérialisation du client avec ses ventes associées.
  const clientSerialise = serialiserClientAvecVentes(client);

  // 5. Rendu de la page cliente. Le rôle est fixé à "EMPLOYEE" car le layout
  //    parent garantit déjà qu'un employé est le seul à pouvoir atteindre cette page.
  return <ClientDetailPageClient client={clientSerialise} role="EMPLOYEE" />;
}