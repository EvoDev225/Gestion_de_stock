import { prisma } from "@/lib/prisma";

export async function listerUtilisateurs() {
    return prisma.utilisateur.findMany({
        select: { id: true, nom: true, email: true, role: true, actif: true, dateCreation: true },
        orderBy: { nom: "asc" },
    });
}

export async function obtenirUtilisateurParId(id: string) {
    return prisma.utilisateur.findUnique({
        where: { id },
        select: { id: true, nom: true, email: true, role: true, actif: true, dateCreation: true },
    });
}

export async function creerUtilisateur(data: {
    nom: string;
    email: string;
    motDePasse: string;
    role?: "ADMIN" | "EMPLOYEE";
}) {
    return prisma.utilisateur.create({
        data,
        select: { id: true, nom: true, email: true, role: true, actif: true },
    });
}

export async function modifierUtilisateur(
    id: string,
    data: { nom?: string; email?: string; role?: "ADMIN" | "EMPLOYEE" }
) {
    return prisma.utilisateur.update({
        where: { id },
        data,
        select: { id: true, nom: true, email: true, role: true, actif: true },
    });
}

export async function desactiverUtilisateur(id: string) {
    return prisma.utilisateur.update({
        where: { id },
        data: { actif: false },
        select: { id: true, nom: true, actif: true },
    });
}