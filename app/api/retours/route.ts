// app/api/retours/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listerRetours, creerRetour } from "@/lib/services/retour.service";

export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get("type") as "CLIENT" | "FOURNISSEUR" | null;
    const retours = await listerRetours(type ?? undefined);
    return NextResponse.json(retours);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.typeRetour || !body.utilisateurId || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "typeRetour, utilisateurId et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const retour = await creerRetour(body);
        return NextResponse.json(retour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}