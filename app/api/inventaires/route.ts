// app/api/inventaires/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listerInventaires, lancerInventaire } from "@/lib/services/inventaire.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const inventaires = await listerInventaires();
    return NextResponse.json(inventaires);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;
    
    const body = await request.json();

    if (!Array.isArray(body.produitIds) || body.produitIds.length === 0) {
        return NextResponse.json(
            { error: "Au moins un produitId est requis" },
            { status: 400 }
        );
    }

    // On utilise l'ID de la session, on l'injecte dans le payload final.
    const inventaire = await lancerInventaire({
        utilisateurId: acces.session.id,
        produitIds: body.produitIds,
    });
    
    return NextResponse.json(inventaire, { status: 201 });
}