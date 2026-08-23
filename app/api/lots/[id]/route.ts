// app/api/lots/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
    obtenirLotParId,
    modifierLot,
    supprimerLot,
} from "@/lib/services/lot.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const lot = await obtenirLotParId(id);

    if (!lot) {
        return NextResponse.json({ error: "Lot introuvable" }, { status: 404 });
    }

    return NextResponse.json(lot);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    const data = {
        ...body,
        ...(body.dateExpiration && { dateExpiration: new Date(body.dateExpiration) }),
    };

    const lot = await modifierLot(id, data);
    return NextResponse.json(lot);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;
    const { id } = await params;

    try {
        await supprimerLot(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Suppression impossible : ce lot est référencé par un mouvement de stock" },
            { status: 409 }
        );
    }
}