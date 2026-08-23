import { NextRequest, NextResponse } from "next/server";
import {
    obtenirUtilisateurParId,
    modifierUtilisateur,
    desactiverUtilisateur,
} from "@/lib/services/utilisateur.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const utilisateur = await obtenirUtilisateurParId(id);

    if (!utilisateur) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json(utilisateur);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;
    const { id } = await params;
    const body = await request.json();
    const utilisateur = await modifierUtilisateur(id, body);
    return NextResponse.json(utilisateur);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;
    const { id } = await params;
    const utilisateur = await desactiverUtilisateur(id);
    return NextResponse.json(utilisateur);
}