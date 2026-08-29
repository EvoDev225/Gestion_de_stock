import { NextRequest, NextResponse } from "next/server";
import {
    listerCommandesFournisseur,
    creerCommandeFournisseur,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const commandes = await listerCommandesFournisseur();
    return NextResponse.json(commandes);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.fournisseurId || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "fournisseurId et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const commande = await creerCommandeFournisseur({
            ...body,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(commande, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}