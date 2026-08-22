import { NextRequest, NextResponse } from "next/server";
import {
  obtenirProduitParId,
  modifierProduit,
  archiverProduit,
} from "@/lib/services/produit.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const produit = await obtenirProduitParId(id);

  if (!produit) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  return NextResponse.json(produit);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const produit = await modifierProduit(id, body);
  return NextResponse.json(produit);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const produit = await archiverProduit(id);
  return NextResponse.json(produit);
}