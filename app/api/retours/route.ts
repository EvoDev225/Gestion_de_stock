// app/api/retours/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerRetours, creerRetour } from "@/lib/services/retour.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerQuery } from "@/lib/validation";

const schemaListeRetours = z
  .object({
    type: z.enum(["CLIENT", "FOURNISSEUR"]).optional(),
  })
  .strip();

const schemaLigneRetour = z.union([
  z
    .object({
      ligneVenteId: z.string().min(1),
      quantite: z.coerce.number().int().min(1),
    })
    .strip(),
  z
    .object({
      lotId: z.string().min(1),
      quantite: z.coerce.number().int().min(1),
    })
    .strip(),
]);

const schemaCreationRetour = z
  .object({
    typeRetour: z.enum(["CLIENT", "FOURNISSEUR"]),
    venteId: z.string().min(1).optional(),
    commandeFournisseurId: z.string().min(1).optional(),
    motif: z.string().max(1000).optional(),
    lignes: z.array(schemaLigneRetour).min(1, "Au moins une ligne est requise"),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = validerQuery(request, schemaListeRetours);
    if (!validation.succes) {
        return validation.erreur;
    }

    const retours = await listerRetours(validation.donnees.type);
    return NextResponse.json(retours);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationRetour);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { typeRetour, venteId, commandeFournisseurId, motif, lignes } =
        validation.donnees;

    try {
        const retour = await creerRetour({
            typeRetour,
            venteId,
            commandeFournisseurId,
            motif,
            lignes,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(retour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}