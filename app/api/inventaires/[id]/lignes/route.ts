// app/api/inventaires/[id]/lignes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exigerRole } from "@/lib/auth";
import { ajouterLigneInventaire } from "@/lib/services/inventaire.service";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaAjouterLigneInventaire = z
  .object({
    produitId: z.string().min(1),
    varianteId: z.string().min(1).nullish(),
  })
  .strip();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) {
        return validationId.erreur;
    }

    const validation = await validerCorps(request, schemaAjouterLigneInventaire);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { produitId, varianteId } = validation.donnees;

    try {
        const ligne = await ajouterLigneInventaire(
            validationId.donnees,
            produitId,
            varianteId ?? null
        );
        return NextResponse.json(ligne, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 409 });
    }
}