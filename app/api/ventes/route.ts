import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import { listerVentes, creerVente } from "@/lib/services/vente.service";

export async function GET(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const ventes = await listerVentes();
    return NextResponse.json(ventes);
}

export async function POST(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const body = await request.json();

    if (!Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "au moins une ligne est requise" },
            { status: 400 }
        );
    }

    try {
        const vente = await creerVente({
            ...body,
            utilisateurId: resultatAuth.session.id,
        });
        return NextResponse.json(vente, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}