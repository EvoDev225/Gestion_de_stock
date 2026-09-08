import { Prisma } from "../../generated/prisma/client";
import type { Client, ClientAvecVentes } from "@/types/client";

type ClientAvecCompte = Prisma.ClientGetPayload<{
    include: { _count: { select: { ventes: true } } };
}>;

type ClientAvecVentesRelations = Prisma.ClientGetPayload<{
    include: {
        ventes: true;
        _count: { select: { ventes: true } };
    };
}>;

export function serialiserClient(client: ClientAvecCompte): Client {
    return {
        id: client.id,
        nom: client.nom,
        telephone: client.telephone,
        email: client.email,
        adresse: client.adresse,
        _count: client._count,
    };
}

export function serialiserClients(clients: ClientAvecCompte[]): Client[] {
    return clients.map(serialiserClient);
}

export function serialiserClientAvecVentes(
    client: ClientAvecVentesRelations
): ClientAvecVentes {
    return {
        id: client.id,
        nom: client.nom,
        telephone: client.telephone,
        email: client.email,
        adresse: client.adresse,
        _count: client._count,
        ventes: client.ventes.map((vente) => ({
            id: vente.id,
            dateVente: vente.dateVente.toISOString(),
            montantTotal: vente.montantTotal.toString(),
            statut: vente.statut,
            modePaiement: vente.modePaiement,
        })),
    };
}