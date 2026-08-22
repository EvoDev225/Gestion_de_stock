import { NextRequest, NextResponse } from "next/server";
import {
    obtenirVarianteParId,
    modifierVariante,
    supprimerVariante,
} from "@/lib/services/variante.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const variante = await obtenirVarianteParId(id);

    if (!variante) {
        return NextResponse.json({ error: "Variante introuvable" }, { status: 404 });
    }

    return NextResponse.json(variante);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const variante = await modifierVariante(id, body);
    return NextResponse.json(variante);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await supprimerVariante(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Suppression impossible : cette variante est référencée ailleurs (mouvement, lot, ligne de vente...)" },
            { status: 409 }
        );
    }
}