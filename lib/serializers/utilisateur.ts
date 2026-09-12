import { Prisma } from "../../generated/prisma/client";
import type { Utilisateur as UtilisateurType } from "@/types/utilisateur";

type UtilisateurListe = Prisma.UtilisateurGetPayload<{
    select: {
        id: true;
        nom: true;
        email: true;
        role: true;
        actif: true;
        dateCreation: true;
    };
}>;

export function serialiserUtilisateur(utilisateur: UtilisateurListe): UtilisateurType {
    return {
        id: utilisateur.id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
        actif: utilisateur.actif,
        dateCreation: utilisateur.dateCreation.toISOString(),
    };
}

export function serialiserUtilisateurs(utilisateurs: UtilisateurListe[]): UtilisateurType[] {
    return utilisateurs.map(serialiserUtilisateur);
}