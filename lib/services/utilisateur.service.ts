import { prisma } from "@/lib/prisma";

export async function creerUtilisateur(data: {
    nom: string;
    email: string;
    motDePasse: string;
    role?: "ADMIN" | "EMPLOYEE";
}) {
    return prisma.utilisateur.create({ data });
}

export async function listerUtilisateurs() {
    return prisma.utilisateur.findMany({
        select: { id: true, nom: true, email: true, role: true, actif: true },
    });
}