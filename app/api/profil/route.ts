import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { obtenirUtilisateurParId, modifierProfil } from "@/lib/services/utilisateur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaModificationProfil = z
  .object({
    nom: z.string().min(1).max(200).optional(),
    email: z.string().email().max(254).optional(),
    motDePasseActuel: z.string().min(1).max(200).optional(),
    nouveauMotDePasse: z.string().min(8).max(200).optional(),
  })
  .strip();

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

    const validation = await validerCorps(request, schemaModificationProfil);

    if (!validation.succes) {
        return validation.erreur;
    }

    const data = validation.donnees;

    try {
        const utilisateur = await modifierProfil(acces.session.id, data);
        return NextResponse.json(utilisateur);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}