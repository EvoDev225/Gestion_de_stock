import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exigerRole } from "@/lib/auth";
import { listerVentes, creerVente } from "@/lib/services/vente.service";
import { serialiserVente, serialiserVentes } from "@/lib/serializers/vente.serializer";
import { validerCorps } from "@/lib/validation";

const schemaCreationVente = z
  .object({
    clientId: z.string().min(1).optional(),
    client: z
      .object({
        nom: z.string().trim().min(1).max(200),
        telephone: z.string().trim().min(1).max(50),
      })
      .strict()
      .optional(),
    modePaiement: z.enum(["TOTAL", "CREDIT"]).optional(),
    lignes: z
      .array(
        z.object({
          produitId: z.string().min(1),
          varianteId: z.string().min(1).optional(),
          lotId: z.string().min(1),
          quantite: z.coerce.number().int().min(1),
          prixUnitaire: z.coerce.number().int().min(0),
          stockInsuffisantConfirme: z.boolean().optional(),
        })
      )
      .min(1, "Au moins une ligne est requise"),
  })
  .strip()
  .refine(
    (data) => !(data.clientId && data.client),
    { message: "Impossible de fournir clientId et client en même temps" }
  );

export async function GET(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const filtreUtilisateurId =
        resultatAuth.session.role === "EMPLOYEE" ? resultatAuth.session.id : undefined;

    const ventes = await listerVentes(filtreUtilisateurId);
    return NextResponse.json(serialiserVentes(ventes));
}

export async function POST(request: NextRequest) {
    const resultatAuth = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in resultatAuth) {
        return resultatAuth.erreur;
    }

    const validation = await validerCorps(request, schemaCreationVente);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { clientId, client, modePaiement, lignes } = validation.donnees;

    try {
        const vente = await creerVente({
            clientId,
            client,
            modePaiement,
            lignes,
            utilisateurId: resultatAuth.session.id,
        });
        return NextResponse.json(serialiserVente(vente), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}