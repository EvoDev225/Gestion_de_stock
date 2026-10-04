import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    obtenirVarianteParId,
    modifierVariante,
    supprimerVariante,
} from "@/lib/services/variante.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationVariante = z
  .object({
    nomVariante: z.string().min(1).max(200).optional(),
    skuVariante: z.string().min(1).max(100).optional(),
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

    const variante = await obtenirVarianteParId(validationId.donnees);

    if (!variante) {
        return NextResponse.json({ error: "Variante introuvable" }, { status: 404 });
    }

    return NextResponse.json(variante);
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

    const validation = await validerCorps(request, schemaModificationVariante);
    if (!validation.succes) {
        return validation.erreur;
    }

    const variante = await modifierVariante(validationId.donnees, validation.donnees);
    return NextResponse.json(variante);
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
        await supprimerVariante(validationId.donnees);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Suppression impossible : cette variante est référencée ailleurs (mouvement, lot, ligne de vente...)" },
            { status: 409 }
        );
    }
}