import { NextRequest, NextResponse } from "next/server";
import { listerProduits, creerProduit } from "@/lib/services/produit.service";

export async function GET() {
  const produits = await listerProduits();
  return NextResponse.json(produits);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.nom || !body.sku || body.prixAchat === undefined || body.prixVente === undefined) {
    return NextResponse.json(
      { error: "nom, sku, prixAchat et prixVente sont requis" },
      { status: 400 }
    );
  }

  try {
    const produit = await creerProduit(body);
    return NextResponse.json(produit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "SKU déjà utilisé ou données invalides" },
      { status: 409 }
    );
  }
}