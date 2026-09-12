import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { enregistrerActivite } from "./journal-activite.service";

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
    utilisateurCreateurId?: string;
}) {
    const motDePasseHash = await bcrypt.hash(data.motDePasse, TOURS_DE_HASHAGE);

    return prisma.$transaction(async (tx) => {
        const utilisateur = await tx.utilisateur.create({
            data: {
                nom: data.nom,
                email: data.email,
                role: data.role,
                motDePasse: motDePasseHash,
            },
            select: { id: true, nom: true, email: true, role: true, actif: true },
        });

        await enregistrerActivite({
            action: "UTILISATEUR_CREE",
            entiteConcerneeType: "Utilisateur",
            entiteConcerneeId: utilisateur.id,
            details: `Compte créé avec le rôle ${utilisateur.role}`,
            utilisateurId: data.utilisateurCreateurId ?? utilisateur.id,
        }, tx);

        return utilisateur;
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

export async function desactiverUtilisateur(id: string, utilisateurAdminId: string) {
    return prisma.$transaction(async (tx) => {
        const utilisateur = await tx.utilisateur.update({
            where: { id },
            data: { actif: false },
            select: { id: true, nom: true, actif: true },
        });

        await enregistrerActivite({
            action: "UTILISATEUR_DESACTIVE",
            entiteConcerneeType: "Utilisateur",
            entiteConcerneeId: utilisateur.id,
            details: `Compte désactivé : ${utilisateur.nom}`,
            utilisateurId: utilisateurAdminId,
        }, tx);

        return utilisateur;
    });
}

export async function modifierProfil(
    id: string,
    data: {
        nom?: string;
        email?: string;
        motDePasseActuel?: string;
        nouveauMotDePasse?: string;
    }
) {
    const utilisateur = await prisma.utilisateur.findUnique({
        where: { id },
        select: { id: true, motDePasse: true },
    });

    if (!utilisateur) {
        throw new Error("Utilisateur introuvable");
    }

    const updateData: { nom?: string; email?: string; motDePasse?: string } = {};

    if (data.nom !== undefined) {
        updateData.nom = data.nom;
    }

    if (data.email !== undefined) {
        updateData.email = data.email;
    }

    if (data.nouveauMotDePasse !== undefined) {
        if (!data.motDePasseActuel) {
            throw new Error("Le mot de passe actuel est requis pour définir un nouveau mot de passe");
        }

        const motDePasseValide = await bcrypt.compare(data.motDePasseActuel, utilisateur.motDePasse);
        if (!motDePasseValide) {
            throw new Error("Mot de passe actuel incorrect");
        }

        updateData.motDePasse = await bcrypt.hash(data.nouveauMotDePasse, TOURS_DE_HASHAGE);
    }

    return prisma.utilisateur.update({
        where: { id },
        data: updateData,
        select: { id: true, nom: true, email: true, role: true, actif: true },
    });
}