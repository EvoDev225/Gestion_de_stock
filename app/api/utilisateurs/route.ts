import { NextRequest, NextResponse } from "next/server";
import { listerUtilisateurs, creerUtilisateur } from "@/lib/services/utilisateur.service";

export async function GET() {
    const utilisateurs = await listerUtilisateurs();
    return NextResponse.json(utilisateurs);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.nom || !body.email || !body.motDePasse) {
        return NextResponse.json(
            { error: "nom, email et motDePasse sont requis" },
            { status: 400 }
        );
    }

    const utilisateur = await creerUtilisateur(body);
    return NextResponse.json(utilisateur, { status: 201 });
}