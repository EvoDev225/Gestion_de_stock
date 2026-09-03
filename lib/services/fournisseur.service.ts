import { prisma } from "@/lib/prisma";

export async function listerFournisseurs() {
    return prisma.fournisseur.findMany({
        orderBy: { nom: "asc" },
        include: { _count: { select: { commandeFournisseurs: true } } },
    });
}

export async function obtenirFournisseurParId(id: string) {
    return prisma.fournisseur.findUnique({
        where: { id },
        include: { _count: { select: { commandeFournisseurs: true } } },
    });
}

function normaliserEmail(email?: string): string | null {
    const trimmed = email?.trim();
    return trimmed ? trimmed : null;
}

export async function creerFournisseur(data: {
    nom: string;
    email?: string;
    telephone: string;
    adresse: string;
}) {
    return prisma.fournisseur.create({
        data: { ...data, email: normaliserEmail(data.email) },
    });
}

export async function modifierFournisseur(
    id: string,
    data: { nom?: string; email?: string; telephone?: string; adresse?: string }
) {
    return prisma.fournisseur.update({
        where: { id },
        data: {
            ...data,
            ...(data.email !== undefined ? { email: normaliserEmail(data.email) } : {}),
        },
    });
}
export async function supprimerFournisseur(id: string) {
    const fournisseur = await prisma.fournisseur.findUnique({
        where: { id },
        include: { _count: { select: { commandeFournisseurs: true } } },
    });

    if (!fournisseur) {
        throw new Error("Fournisseur introuvable");
    }

    if (fournisseur._count.commandeFournisseurs > 0) {
        throw new Error(
            `Impossible de supprimer ce fournisseur : il est lié à ${fournisseur._count.commandeFournisseurs} commande(s)`
        );
    }

    return prisma.fournisseur.delete({ where: { id } });
}