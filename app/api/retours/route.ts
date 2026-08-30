// app/api/retours/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listerRetours, creerRetour } from "@/lib/services/retour.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const type = request.nextUrl.searchParams.get("type") as "CLIENT" | "FOURNISSEUR" | null;
    const retours = await listerRetours(type ?? undefined);
    return NextResponse.json(retours);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.typeRetour || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "typeRetour et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const retour = await creerRetour({
            ...body,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(retour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}