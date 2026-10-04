import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerMouvementsStock } from "@/lib/services/mouvement-stock.service";
import { exigerRole } from "@/lib/auth";
import { validerQuery } from "@/lib/validation";

const schemaListeMouvementsStock = z
  .object({
    produitId: z.string().min(1).optional(),
    varianteId: z.string().min(1).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = validerQuery(request, schemaListeMouvementsStock);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { produitId, varianteId } = validation.donnees;

    const mouvements = await listerMouvementsStock({ produitId, varianteId });
    return NextResponse.json(mouvements);
}