import { NextRequest, NextResponse } from "next/server";
import { obtenirVenteParId, annulerVente } from "@/lib/services/vente.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const vente = await obtenirVenteParId(id);

    if (!vente) {
        return NextResponse.json({ error: "Vente introuvable" }, { status: 404 });
    }

    return NextResponse.json(vente);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const vente = await annulerVente(id);
    return NextResponse.json(vente);
}