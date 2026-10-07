import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    listerCommandesFournisseur,
    creerCommandeFournisseur,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationCommandeFournisseur = z
  .object({
    fournisseurId: z.string().min(1),
    lignes: z
      .array(
        z.object({
          produitId: z.string().min(1),
          quantiteCommande: z.coerce.number().int().min(1),
          prixAchatUnitaire: z.coerce.number().int().min(0),
          varianteId: z.string().min(1).optional(),
        })
      )
      .min(1, "Au moins une ligne est requise"),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const commandes = await listerCommandesFournisseur();
    return NextResponse.json(commandes);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationCommandeFournisseur);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { fournisseurId, lignes } = validation.donnees;

    try {
        const commande = await creerCommandeFournisseur({
            fournisseurId,
            utilisateurId: acces.session.id,
            lignes,
        });
        return NextResponse.json(commande, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}