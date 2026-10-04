import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    obtenirCategorieParId,
    modifierCategorie,
    supprimerCategorie,
} from "@/lib/services/categorie.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationCategorie = z
  .object({
    nom: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
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

    const categorie = await obtenirCategorieParId(validationId.donnees);

    if (!categorie) {
        return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }

    return NextResponse.json(categorie);
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

    const validation = await validerCorps(request, schemaModificationCategorie);
    if (!validation.succes) {
        return validation.erreur;
    }

    const categorie = await modifierCategorie(validationId.donnees, validation.donnees);
    return NextResponse.json(categorie);
}

export async function DELETE(
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

    try {
        await supprimerCategorie(validationId.donnees);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 409 }
        );
    }
}