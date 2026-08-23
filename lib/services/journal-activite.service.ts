import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
export async function listerJournalActivite(utilisateurId?: string) {
    return prisma.journalActivite.findMany({
        where: utilisateurId ? { utilisateurId } : undefined,
        include: { utilisateur: true },
        orderBy: { dateAction: "desc" },
    });
}

// Utilitaire interne, à appeler depuis les AUTRES services plus tard
export async function enregistrerActivite(
    data: {
        action: string;
        entiteConcerneeType?: string;
        entiteConcerneeId?: string;
        details?: string;
        utilisateurId: string;
    },
    client: Prisma.TransactionClient | typeof prisma = prisma
) {
    return client.journalActivite.create({ data });
}