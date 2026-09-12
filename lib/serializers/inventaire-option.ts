import type { InventaireOption } from "@/types/rapport";
import type { Prisma } from "@/generated/prisma/client";

type InventairePrisma = Prisma.InventaireGetPayload<{
    include: {
        lignesInventaire: {
            include: { produit: true; variante: true };
        };
    };
}>;

export function serialiserInventaireOptions(
    inventaires: InventairePrisma[],
): InventaireOption[] {
    return inventaires.map((inventaire) => ({
        id: inventaire.id,
        dateLancement: inventaire.dateLancement.toISOString(),
        statut: inventaire.statut,
    }));
}