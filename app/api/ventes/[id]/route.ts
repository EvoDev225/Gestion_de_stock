import { NextRequest, NextResponse } from "next/server";
import { obtenirVenteParId, annulerVente } from "@/lib/services/vente.service";
import { exigerRole } from "@/lib/auth";
import { serialiserVente } from "@/lib/serializers/vente.serializer";

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
    return NextResponse.json(serialiserVente(vente));
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const body = await request.json();

    if (body.statut !== "ANNULEE") {
        return NextResponse.json(
            { error: "Seule la transition vers ANNULEE est autorisée via cette route" },
            { status: 400 }
        );
    }

    const venteExistante = await obtenirVenteParId(id);
    if (!venteExistante) {
        return NextResponse.json({ error: "Vente introuvable" }, { status: 404 });
    }
    if (venteExistante.statut === "ANNULEE") {
        return NextResponse.json({ error: "Cette vente est déjà annulée" }, { status: 409 });
    }

    const vente = await annulerVente(id, acces.session.id);
return NextResponse.json(serialiserVente(vente));
}