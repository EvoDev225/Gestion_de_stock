// app/api/inventaires/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { obtenirInventaireParId, validerInventaire } from "@/lib/services/inventaire.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const inventaire = await obtenirInventaireParId(id);

    if (!inventaire) {
        return NextResponse.json({ error: "Inventaire introuvable" }, { status: 404 });
    }

    return NextResponse.json(inventaire);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;
    
    const { id } = await params;
    const body = await request.json();

    if (!Array.isArray(body.saisies) || body.saisies.length === 0) {
        return NextResponse.json({ error: "saisies requis" }, { status: 400 });
    }

    try {
        // Injection de acces.session.id comme 3ème paramètre (validateur)
        const inventaire = await validerInventaire(id, body.saisies, acces.session.id);
        return NextResponse.json(inventaire);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}