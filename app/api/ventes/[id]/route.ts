import { NextRequest, NextResponse } from "next/server";
import { obtenirVenteParId, annulerVente } from "@/lib/services/vente.service";
import { obtenirSession } from "@/lib/auth";

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
    const session = await obtenirSession(request);
    if (!session) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id } = await params;
    const vente = await annulerVente(id, session.id);
    return NextResponse.json(vente);
}