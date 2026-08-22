import { prisma } from "@/lib/prisma";

export async function listerFournisseurs() {
    return prisma.fournisseur.findMany({
        orderBy: { nom: "asc" },
    });
}

export async function obtenirFournisseurParId(id: string) {
    return prisma.fournisseur.findUnique({
        where: { id },
    });
}

export async function creerFournisseur(data: {
    nom: string;
    email?: string;
    telephone: string;
    adresse: string;
}) {
    return prisma.fournisseur.create({ data });
}

export async function modifierFournisseur(
    id: string,
    data: { nom?: string; email?: string; telephone?: string; adresse?: string }
) {
    return prisma.fournisseur.update({ where: { id }, data });
}

export async function supprimerFournisseur(id: string) {
    return prisma.fournisseur.delete({ where: { id } });
}