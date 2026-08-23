import { NextRequest, NextResponse } from "next/server";
import {
    listerCommandesFournisseur,
    creerCommandeFournisseur,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";

export async function GET() {
    const commandes = await listerCommandesFournisseur();
    return NextResponse.json(commandes);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
        if ("erreur" in acces) return acces.erreur;
    const body = await request.json();

    if (!body.fournisseurId || !body.utilisateurId || !Array.isArray(body.lignes) || body.lignes.length === 0) {
        return NextResponse.json(
            { error: "fournisseurId, utilisateurId et au moins une ligne sont requis" },
            { status: 400 }
        );
    }

    try {
        const commande = await creerCommandeFournisseur(body);
        return NextResponse.json(commande, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}