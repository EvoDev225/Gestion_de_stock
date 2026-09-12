import type { Rapport } from "@/types/rapport";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Type brut d'un rapport d'activité renvoyé par Prisma,
 * avec l'utilisateur inclus (champs sélectionnés).
 */
type RapportPrisma = Prisma.RapportActiviteGetPayload<{
    include: {
        utilisateur: {
            select: { id: true; nom: true; email: true };
        };
    };
}>;

/**
 * Sérialise un rapport Prisma vers le type frontend `Rapport`.
 *
 * - Convertit `dateGeneration`, `dateDebut` et `dateFin` en chaînes ISO.
 * - Copie le contenu Markdown tel quel.
 * - Ne conserve que `id`, `nom` et `email` pour l'utilisateur.
 */
export function serialiserRapport(rapport: RapportPrisma): Rapport {
    return {
        id: rapport.id,
        dateGeneration: rapport.dateGeneration.toISOString(),
        dateDebut: rapport.dateDebut.toISOString(),
        dateFin: rapport.dateFin.toISOString(),
        contenu: rapport.contenu,
        utilisateurId: rapport.utilisateurId,
        utilisateur: {
            id: rapport.utilisateur.id,
            nom: rapport.utilisateur.nom,
            email: rapport.utilisateur.email,
        },
    };
}

/**
 * Sérialise une liste de rapports Prisma vers un tableau
 * de rapports au format frontend.
 */
export function serialiserRapports(rapports: RapportPrisma[]): Rapport[] {
    return rapports.map(serialiserRapport);
}