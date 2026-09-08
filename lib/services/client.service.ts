import { prisma } from "@/lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { enregistrerActivite } from "./journal-activite.service";

function normaliserChampOptionnel(valeur?: string): string | undefined {
    if (valeur === undefined || valeur.trim() === "") {
        return undefined;
    }
    return valeur.trim();
}

export async function listerClients() {
    return prisma.client.findMany({
        include: { _count: { select: { ventes: true } } },
        orderBy: { nom: "asc" },
    });
}

export async function obtenirClientParId(id: string) {
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            ventes: {
                orderBy: { dateVente: "desc" },
                take: 10,
            },
            _count: { select: { ventes: true } },
        },
    });

    if (!client) {
        throw new Error("Client introuvable");
    }

    return client;
}

export async function creerClient(data: {
    nom: string;
    telephone: string;
    email?: string;
    adresse?: string;
    utilisateurId: string;
}) {
    if (!data.nom || data.nom.trim() === "") {
        throw new Error("Le nom du client est obligatoire");
    }

    if (!data.telephone || data.telephone.trim() === "") {
        throw new Error("Le téléphone du client est obligatoire pour assurer la traçabilité");
    }

    try {
        const client = await prisma.client.create({
            data: {
                nom: data.nom.trim(),
                telephone: data.telephone.trim(),
                email: normaliserChampOptionnel(data.email),
                adresse: normaliserChampOptionnel(data.adresse),
            },
        });

        await enregistrerActivite({
            action: "CLIENT_CREE",
            entiteConcerneeType: "Client",
            entiteConcerneeId: client.id,
            details: `Client créé : ${client.nom}`,
            utilisateurId: data.utilisateurId,
        });

        return client;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new Error("Un client avec cet email existe déjà");
        }
        throw error;
    }
}

export async function modifierClient(
    id: string,
    data: {
        nom?: string;
        telephone?: string;
        email?: string;
        adresse?: string;
        utilisateurId: string;
    }
) {
    const clientExistant = await prisma.client.findUnique({ where: { id } });
    if (!clientExistant) {
        throw new Error("Client introuvable");
    }

    if (data.nom !== undefined && data.nom.trim() === "") {
        throw new Error("Le nom du client ne peut pas être vide");
    }

    if (data.telephone !== undefined && data.telephone.trim() === "") {
        throw new Error("Le téléphone du client ne peut pas être vide");
    }

    try {
        const client = await prisma.client.update({
            where: { id },
            data: {
                nom: data.nom?.trim(),
                telephone: data.telephone?.trim(),
                email: normaliserChampOptionnel(data.email),
                adresse: normaliserChampOptionnel(data.adresse),
            },
        });

        await enregistrerActivite({
            action: "CLIENT_MODIFIE",
            entiteConcerneeType: "Client",
            entiteConcerneeId: client.id,
            details: `Client modifié : ${client.nom}`,
            utilisateurId: data.utilisateurId,
        });

        return client;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new Error("Un client avec cet email existe déjà");
        }
        throw error;
    }
}

export async function supprimerClient(id: string, utilisateurId: string) {
    const client = await prisma.client.findUnique({
        where: { id },
        include: { _count: { select: { ventes: true } } },
    });

    if (!client) {
        throw new Error("Client introuvable");
    }

    if (client._count.ventes > 0) {
        throw new Error(
            `Impossible de supprimer ce client : ${client._count.ventes} vente(s) associée(s)`
        );
    }

    await prisma.client.delete({ where: { id } });

    await enregistrerActivite({
        action: "CLIENT_SUPPRIME",
        entiteConcerneeType: "Client",
        entiteConcerneeId: id,
        details: `Client supprimé : ${client.nom}`,
        utilisateurId,
    });

    return client;
}