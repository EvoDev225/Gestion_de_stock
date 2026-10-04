import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exigerRole } from "@/lib/auth";
import {
    obtenirFournisseurParId,
    modifierFournisseur,
    supprimerFournisseur,
} from "@/lib/services/fournisseur.service";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationFournisseur = z
  .object({
    nom: z.string().trim().min(1).max(200).optional(),
    email: z.union([z.literal(""), z.string().email().max(254)]).optional(),
    telephone: z.string().trim().min(1).max(50).optional(),
    adresse: z.string().trim().min(1).max(500).optional(),
  })
  .strip();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) {
        return validationId.erreur;
    }

    const fournisseur = await obtenirFournisseurParId(validationId.donnees);

    if (!fournisseur) {
        return NextResponse.json({ error: "Fournisseur introuvable" }, { status: 404 });
    }

    return NextResponse.json(fournisseur);
}

export async function PATCH(
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

    const validation = await validerCorps(request, schemaModificationFournisseur);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { nom, email, telephone, adresse } = validation.donnees;

    const fournisseur = await modifierFournisseur(validationId.donnees, {
        nom,
        email,
        telephone,
        adresse,
    });
    return NextResponse.json(fournisseur);
}

export async function DELETE(
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

    try {
        await supprimerFournisseur(validationId.donnees);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.code === "P2025") {
            return NextResponse.json({ error: "Fournisseur introuvable" }, { status: 404 });
        }
        if (error.code === "P2003") {
            return NextResponse.json(
                { error: "Suppression impossible : ce fournisseur a des commandes liées" },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}