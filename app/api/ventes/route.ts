import { NextRequest, NextResponse } from "next/server";
import { listerVentes, creerVente } from "@/lib/services/vente.service";

export async function GET() {
    const ventes = await listerVentes();
    return NextResponse.json(ventes);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.utilisateurId || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "utilisateurId et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const vente = await creerVente(body);
        return NextResponse.json(vente, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}