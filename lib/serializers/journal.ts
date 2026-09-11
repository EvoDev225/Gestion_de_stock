import type { Activite } from "@/types/journal";
import type { Prisma } from "@/generated/prisma/client";
type ActivitePrisma = Prisma.JournalActiviteGetPayload<{
    include: { utilisateur: true };
}>;

export function serialiserActivite(activite: ActivitePrisma): Activite {
    return {
        id: activite.id,
        action: activite.action,
        entiteConcerneeType: activite.entiteConcerneeType,
        entiteConcerneeId: activite.entiteConcerneeId,
        details: activite.details,
        dateAction: activite.dateAction.toISOString(),
        utilisateurId: activite.utilisateurId,
        utilisateur: {
            id: activite.utilisateur.id,
            nom: activite.utilisateur.nom,
        },
    };
}

export function serialiserActivites(activites: ActivitePrisma[]): Activite[] {
    return activites.map(serialiserActivite);
}