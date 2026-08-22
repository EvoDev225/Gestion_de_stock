import { NextRequest, NextResponse } from "next/server";
import { listerReceptions, creerReception } from "@/lib/services/reception-fournisseur.service";

export async function GET(request: NextRequest) {
    const commandeFournisseurId = request.nextUrl.searchParams.get("commandeFournisseurId") ?? undefined;
    const receptions = await listerReceptions(commandeFournisseurId);
    return NextResponse.json(receptions);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.commandeFournisseurId || !body.utilisateurId || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "commandeFournisseurId, utilisateurId et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const reception = await creerReception(body);
        return NextResponse.json(reception, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}