import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerUtilisateurs, creerUtilisateur } from "@/lib/services/utilisateur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationUtilisateur = z
  .object({
    nom: z.string().min(1).max(200),
    email: z.string().email().max(254),
    motDePasse: z.string().min(8).max(200),
    role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const utilisateurs = await listerUtilisateurs();
    return NextResponse.json(utilisateurs);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationUtilisateur);

    if (!validation.succes) {
        return validation.erreur;
    }

    const { nom, email, motDePasse, role } = validation.donnees;

    const utilisateur = await creerUtilisateur({
        nom,
        email,
        motDePasse,
        role,
        utilisateurCreateurId: acces.session.id,
    });

    return NextResponse.json(utilisateur, { status: 201 });
}