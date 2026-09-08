import { redirect } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import { listerClients } from "@/lib/services/client.service";
import { serialiserClients } from "@/lib/serializers/client";
import ClientsPageClient from "@/app/dashboard/clients/ClientsPageClient";

export default async function ClientsPage() {
  const session = await obtenirSessionServeur();

  if (!session) {
    redirect("/connexion");
  }

  const clients = await listerClients();
  const clientsSerialises = serialiserClients(clients);

  return <ClientsPageClient clients={clientsSerialises} role={session.role} />;
}