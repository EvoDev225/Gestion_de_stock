import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerVariantes, creerVariante } from "@/lib/services/variante.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerQuery } from "@/lib/validation";

const schemaListeVariantes = z
  .object({
    produitId: z.string().min(1).optional(),
  })
  .strip();

const schemaCreationVariante = z
  .object({
    nomVariante: z.string().min(1).max(200),
    produitId: z.string().min(1),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = validerQuery(request, schemaListeVariantes);
    if (!validation.succes) {
        return validation.erreur;
    }

    const variantes = await listerVariantes(validation.donnees.produitId);
    return NextResponse.json(variantes);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationVariante);

    if (!validation.succes) {
        return validation.erreur;
    }

    const { nomVariante, produitId } = validation.donnees;

    try {
        const variante = await creerVariante({ nomVariante, produitId });
        return NextResponse.json(variante, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la création de la variante" }, { status: 409 });
    }
}