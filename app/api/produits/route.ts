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
    imageUrl: z.string().max(3_000_000).optional(), // data URL ou URL externe
  })
  .strip();

  const schemaFichier = z.object({
    type: z.string().refine(
        (t) => ["image/jpeg", "image/png", "image/webp"].includes(t),
        "Type d'image non supporté (JPEG, PNG ou WebP uniquement)"
    ),
    size: z.number().max(2 * 1024 * 1024, "Image trop lourde (2 Mo maximum)"),
    name: z.string().min(1),
});


export async function GET(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
  if ("erreur" in acces) return acces.erreur;

  const produits = await listerProduitsAvecStock();
  return NextResponse.json(produits);
}

export async function POST(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN"]); // adapte les rôles
  if ("erreur" in acces) return acces.erreur;

  try {
    const body = await request.json().catch(() => null);
    const parsed = schemaCreationProduit.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Données invalides" },
        { status: 400 }
      );
    }

    const produit = await creerProduit(parsed.data);
    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    console.error("Erreur création produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
}