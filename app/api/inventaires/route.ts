// app/api/inventaires/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerInventaires, lancerInventaire } from "@/lib/services/inventaire.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaLancerInventaire = z
  .object({
    produitIds: z.array(z.string().min(1)).min(1, "Au moins un produitId est requis"),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const inventaires = await listerInventaires();
    return NextResponse.json(inventaires);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaLancerInventaire);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { produitIds } = validation.donnees;

    try {
        const inventaire = await lancerInventaire({
            utilisateurId: acces.session.id,
            produitIds,
        });

        return NextResponse.json(inventaire, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Erreur lors du lancement de l'inventaire";
        return NextResponse.json({ error: message }, { status: 409 });
    }
}