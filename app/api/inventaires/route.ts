// app/api/inventaires/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listerInventaires, lancerInventaire } from "@/lib/services/inventaire.service";

export async function GET() {
    const inventaires = await listerInventaires();
    return NextResponse.json(inventaires);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.utilisateurId || !Array.isArray(body.produitIds) || body.produitIds.length === 0) {
        return NextResponse.json(
            { error: "utilisateurId et au moins un produitId sont requis" },
            { status: 400 }
        );
    }

    const inventaire = await lancerInventaire(body);
    return NextResponse.json(inventaire, { status: 201 });
}