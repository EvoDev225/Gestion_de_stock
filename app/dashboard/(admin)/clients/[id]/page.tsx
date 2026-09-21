import { redirect, notFound } from "next/navigation";
import { obtenirSessionServeur } from "@/lib/auth";
import { obtenirClientParId } from "@/lib/services/client.service";
import { serialiserClientAvecVentes } from "@/lib/serializers/client";
import ClientDetailPageClient from "@/app/dashboard/clients/ClientDetailPageClient";

export default async function ClientDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/connexion");
    }

    const { id } = await params;

    let client;
    try {
        client = await obtenirClientParId(id);
    } catch {
        notFound();
    }

    const clientSerialise = serialiserClientAvecVentes(client);

    return <ClientDetailPageClient client={clientSerialise} role={session.role} />;
}