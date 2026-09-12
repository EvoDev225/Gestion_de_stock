import { NextRequest, NextResponse } from "next/server";
import { obtenirUtilisateurParId, modifierProfil } from "@/lib/services/utilisateur.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const utilisateur = await obtenirUtilisateurParId(acces.session.id);
    if (!utilisateur) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json(utilisateur);
}

export async function PATCH(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    const data: {
        nom?: string;
        email?: string;
        motDePasseActuel?: string;
        nouveauMotDePasse?: string;
    } = {};

    if (typeof body.nom === "string") {
        data.nom = body.nom;
    }
    if (typeof body.email === "string") {
        data.email = body.email;
    }
    if (typeof body.motDePasseActuel === "string") {
        data.motDePasseActuel = body.motDePasseActuel;
    }
    if (typeof body.nouveauMotDePasse === "string") {
        data.nouveauMotDePasse = body.nouveauMotDePasse;
    }

    try {
        const utilisateur = await modifierProfil(acces.session.id, data);
        return NextResponse.json(utilisateur);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}