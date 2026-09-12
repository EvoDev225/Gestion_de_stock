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
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

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

    const CHAMPS_AUTORISES = ["nom", "email", "role"] as const;
    const data: { nom?: string; email?: string; role?: "ADMIN" | "EMPLOYEE" } = {};

    for (const champ of CHAMPS_AUTORISES) {
        if (body[champ] !== undefined) {
            data[champ] = body[champ];
        }
    }

    if (data.role && !["ADMIN", "EMPLOYEE"].includes(data.role)) {
        return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    const utilisateur = await modifierUtilisateur(id, data);
    return NextResponse.json(utilisateur);
}