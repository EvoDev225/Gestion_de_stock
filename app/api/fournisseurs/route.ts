import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerFournisseurs, creerFournisseur } from "@/lib/services/fournisseur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationFournisseur = z
  .object({
    nom: z.string().trim().min(1).max(200),
    email: z.union([z.literal(""), z.string().email().max(254)]).optional(),
    telephone: z.string().trim().min(1).max(50),
    adresse: z.string().trim().min(1).max(500),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const fournisseurs = await listerFournisseurs();
    return NextResponse.json(fournisseurs);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationFournisseur);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { nom, email, telephone, adresse } = validation.donnees;

    try {
        const fournisseur = await creerFournisseur({
            nom,
            email,
            telephone,
            adresse,
        });
        return NextResponse.json(fournisseur, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}