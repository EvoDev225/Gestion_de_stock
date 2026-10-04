// app/api/inventaires/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { obtenirInventaireParId, validerInventaire } from "@/lib/services/inventaire.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaValiderInventaire = z
  .object({
    saisies: z
      .array(
        z.object({
          ligneInventaireId: z.string().min(1),
          quantitePhysique: z.coerce.number().int().min(0),
          justification: z.string().max(1000).optional(),
        })
      )
      .min(1, "saisies requis"),
  })
  .strip();

export async function GET(
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

    const inventaire = await obtenirInventaireParId(validationId.donnees);

    if (!inventaire) {
        return NextResponse.json({ error: "Inventaire introuvable" }, { status: 404 });
    }

    return NextResponse.json(inventaire);
}

export async function PATCH(
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

    const validation = await validerCorps(request, schemaValiderInventaire);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { saisies } = validation.donnees;

    try {
        const inventaire = await validerInventaire(
            validationId.donnees,
            saisies,
            acces.session.id
        );
        return NextResponse.json(inventaire);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}