import { NextRequest, NextResponse } from "next/server";
import { listerUtilisateurs, creerUtilisateur } from "@/lib/services/utilisateur.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const utilisateurs = await listerUtilisateurs();
    return NextResponse.json(utilisateurs);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.nom || !body.email || !body.motDePasse) {
        return NextResponse.json(
            { error: "nom, email et motDePasse sont requis" },
            { status: 400 }
        );
    }

    const utilisateur = await creerUtilisateur({
        ...body,
        utilisateurCreateurId: acces.session.id,
    });
    return NextResponse.json(utilisateur, { status: 201 });
}