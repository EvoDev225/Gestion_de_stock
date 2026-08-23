import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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

const TOURS_DE_HASHAGE = 10;

export async function creerUtilisateur(data: {
    nom: string;
    email: string;
    motDePasse: string;
    role?: "ADMIN" | "EMPLOYEE";
}) {
    const motDePasseHash = await bcrypt.hash(data.motDePasse, TOURS_DE_HASHAGE);

    return prisma.utilisateur.create({
        data: {
            ...data,
            motDePasse: motDePasseHash,
        },
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