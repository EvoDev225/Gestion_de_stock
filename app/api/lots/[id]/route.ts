import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    obtenirLotParId,
    modifierLot,
    supprimerLot,
} from "@/lib/services/lot.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationLot = z
  .object({
    numeroLot: z.string().min(1).max(100).optional(),
    dateExpiration: z.coerce.date().optional(),
    quantite: z.coerce.number().min(0).optional(),
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

    const lot = await obtenirLotParId(validationId.donnees);

    if (!lot) {
        return NextResponse.json({ error: "Lot introuvable" }, { status: 404 });
    }

    return NextResponse.json(lot);
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

    const validation = await validerCorps(request, schemaModificationLot);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { numeroLot, dateExpiration, quantite } = validation.donnees;

    const lot = await modifierLot(validationId.donnees, {
        numeroLot,
        dateExpiration,
        quantite,
    });
    return NextResponse.json(lot);
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
        await supprimerLot(validationId.donnees);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Suppression impossible : ce lot est référencé par un mouvement de stock" },
            { status: 409 }
        );
    }
}