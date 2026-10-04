import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerProduitsAvecStock, creerProduit } from "@/lib/services/produit.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationProduit = z
  .object({
    nom: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    prixAchat: z.coerce.number().int().min(0),
    prixVente: z.coerce.number().int().min(0),
    seuilMinimum: z.coerce.number().int().min(0).optional(),
    categorieId: z.string().min(1).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
  if ("erreur" in acces) return acces.erreur;

  const produits = await listerProduitsAvecStock();
  return NextResponse.json(produits);
}

export async function POST(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN"]);
  if ("erreur" in acces) return acces.erreur;

  const validation = await validerCorps(request, schemaCreationProduit);

  if (!validation.succes) {
    return validation.erreur;
  }

  const { nom, description, prixAchat, prixVente, seuilMinimum, categorieId } =
    validation.donnees;

  try {
    const produit = await creerProduit({
      nom,
      description,
      prixAchat,
      prixVente,
      seuilMinimum,
      categorieId,
    });
    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Données invalides" },
      { status: 409 }
    );
  }
}