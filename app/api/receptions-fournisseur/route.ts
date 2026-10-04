import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exigerRole } from "@/lib/auth";
import { listerReceptions, creerReception } from "@/lib/services/reception-fournisseur.service";
import { validerCorps, validerQuery } from "@/lib/validation";

const schemaListeReceptions = z
  .object({
    commandeFournisseurId: z.string().min(1).optional(),
  })
  .strip();

const schemaCreationReception = z
  .object({
    commandeFournisseurId: z.string().min(1),
    lignes: z
      .array(
        z.object({
          ligneCommandeFournisseurId: z.string().min(1),
          quantiteRecue: z.coerce.number().int().min(1),
        })
      )
      .min(1, "Au moins une ligne est requise"),
  })
  .strip();

export async function GET(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const validation = validerQuery(request, schemaListeReceptions);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { commandeFournisseurId } = validation.donnees;
    const receptions = await listerReceptions(commandeFournisseurId);
    return NextResponse.json(receptions);
}

export async function POST(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const validation = await validerCorps(request, schemaCreationReception);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { commandeFournisseurId, lignes } = validation.donnees;

    try {
        const reception = await creerReception({
            commandeFournisseurId,
            utilisateurId: resultatAuth.session.id,
            lignes,
        });
        return NextResponse.json(reception, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}