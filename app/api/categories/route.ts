import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerCategories, creerCategorie } from "@/lib/services/categorie.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationCategorie = z
  .object({
    nom: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const categories = await listerCategories();
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationCategorie);

    if (!validation.succes) {
        return validation.erreur;
    }

    const { nom, description } = validation.donnees;

    const categorie = await creerCategorie({
        nom,
        description,
    });
    return NextResponse.json(categorie, { status: 201 });
}