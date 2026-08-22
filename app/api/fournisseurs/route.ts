import { NextRequest, NextResponse } from "next/server";
import { listerFournisseurs, creerFournisseur } from "@/lib/services/fournisseur.service";

export async function GET() {
    const fournisseurs = await listerFournisseurs();
    return NextResponse.json(fournisseurs);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.nom || !body.telephone || !body.adresse) {
        return NextResponse.json(
            { error: "nom, telephone et adresse sont requis" },
            { status: 400 }
        );
    }

    try {
        const fournisseur = await creerFournisseur(body);
        return NextResponse.json(fournisseur, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }
}