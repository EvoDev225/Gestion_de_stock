import { prisma } from "@/lib/prisma";

export async function listerClients() {
    return prisma.client.findMany({
        orderBy: { nom: "asc" },
    });
}

export async function obtenirClientParId(id: string) {
    return prisma.client.findUnique({
        where: { id },
    });
}

export async function creerClient(data: {
    nom: string;
    email?: string;
    telephone?: string;
    adresse?: string;
}) {
    return prisma.client.create({ data });
}

export async function modifierClient(
    id: string,
    data: { nom?: string; email?: string; telephone?: string; adresse?: string }
) {
    return prisma.client.update({ where: { id }, data });
}

export async function supprimerClient(id: string) {
    return prisma.client.delete({ where: { id } });
}