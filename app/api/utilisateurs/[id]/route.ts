import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    obtenirUtilisateurParId,
    modifierUtilisateur,
    desactiverUtilisateur,
    reactiverUtilisateur,
} from "@/lib/services/utilisateur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationUtilisateur = z
  .object({
    nom: z.string().min(1).max(200).optional(),
    email: z.string().email().max(254).optional(),
    role: z.enum(["ADMIN", "EMPLOYEE"]).optional(),
    actif: z.boolean().optional(),
  })
  .strip();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);

    if (!validationId.succes) {
        return validationId.erreur;
    }

    const utilisateur = await obtenirUtilisateurParId(validationId.donnees);

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

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) return validationId.erreur;

    const validation = await validerCorps(request, schemaModificationUtilisateur);
    if (!validation.succes) return validation.erreur;

    const data = validation.donnees;
    const id = validationId.donnees;

    try {
    let utilisateur;
    
    if (data.actif === false) {
        utilisateur = await desactiverUtilisateur(id, acces.session.id);
    } else if (data.actif === true) {
        utilisateur = await reactiverUtilisateur(id, acces.session.id);
    } else {
        // ❌ AVANT (cause l'erreur ESLint)
        // const { actif: _actif, ...autresDonnees } = data;
        // utilisateur = await modifierUtilisateur(id, autresDonnees);
        
        // ✅ APRÈS (plus propre, pas de destructuring inutile)
        utilisateur = await modifierUtilisateur(id, data);
    }
    
    return NextResponse.json(utilisateur);
} catch (error) {
        console.error("Erreur modification utilisateur:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur lors de la modification" },
            { status: 500 }
        );
    }
}