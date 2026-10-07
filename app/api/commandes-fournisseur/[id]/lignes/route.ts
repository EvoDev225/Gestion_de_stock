import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ajouterLigneCommande } from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaAjoutLigneCommande = z
  .object({
    produitId: z.string().min(1),
    quantiteCommande: z.coerce.number().int().min(1),
    prixAchatUnitaire: z.coerce.number().int().min(1),
    varianteId: z.string().min(1).optional(),
  })
  .strip();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) {
        return validationId.erreur;
    }

    const validation = await validerCorps(request, schemaAjoutLigneCommande);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { produitId, quantiteCommande, prixAchatUnitaire, varianteId } = validation.donnees;

    try {
        const ligne = await ajouterLigneCommande(
            validationId.donnees,
            { produitId, quantiteCommande, prixAchatUnitaire, varianteId },
            acces.session.id
        );
        return NextResponse.json(ligne, { status: 201 });
    } catch (error) {
        if (error instanceof Error && "code" in error && (error as { code: string }).code === "P2003") {
            return NextResponse.json({ error: "Produit introuvable" }, { status: 400 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}