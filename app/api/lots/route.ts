import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerLots, creerLot } from "@/lib/services/lot.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerQuery } from "@/lib/validation";

const schemaListeLots = z
  .object({
    produitId: z.string().min(1).optional(),
    varianteId: z.string().min(1).optional(),
    commandeFournisseurId: z.string().min(1).optional(),
  })
  .strip();

const schemaCreationLot = z
  .object({
    dateExpiration: z.coerce.date(),
    quantite: z.coerce.number().min(1),
    dateReception: z.coerce.date(),
    produitId: z.string().min(1).optional(),
    varianteId: z.string().min(1).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = validerQuery(request, schemaListeLots);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { produitId, varianteId, commandeFournisseurId } = validation.donnees;
    const lots = await listerLots(produitId, varianteId, commandeFournisseurId);
    return NextResponse.json(lots);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationLot);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { dateExpiration, quantite, dateReception, produitId, varianteId } =
        validation.donnees;

    try {
        const lot = await creerLot({
            dateExpiration,
            quantite,
            dateReception,
            produitId,
            varianteId,
        });
        return NextResponse.json(lot, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}