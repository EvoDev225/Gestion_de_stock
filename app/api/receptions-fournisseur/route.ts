import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import { listerReceptions, creerReception } from "@/lib/services/reception-fournisseur.service";

export async function GET(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const commandeFournisseurId = request.nextUrl.searchParams.get("commandeFournisseurId") ?? undefined;
    const receptions = await listerReceptions(commandeFournisseurId);
    return NextResponse.json(receptions);
}

export async function POST(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const body = await request.json();

    if (!body.commandeFournisseurId || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "commandeFournisseurId et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const reception = await creerReception({
            ...body,
            utilisateurId: resultatAuth.session.id,
        });
        return NextResponse.json(reception, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}