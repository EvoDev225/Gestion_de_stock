import { NextRequest, NextResponse } from "next/server";
import { obtenirVenteParId, annulerVente } from "@/lib/services/vente.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

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
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const vente = await annulerVente(id, acces.session.id);
    return NextResponse.json(vente);
}