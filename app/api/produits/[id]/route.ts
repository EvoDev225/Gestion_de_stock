import { NextRequest, NextResponse } from "next/server";
import {
  obtenirProduitParId,
  modifierProduit,
  archiverProduit,
} from "@/lib/services/produit.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
  if ("erreur" in acces) return acces.erreur;

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
  const acces = await exigerRole(request, ["ADMIN"]);
  if ("erreur" in acces) return acces.erreur;

  const { id } = await params;
  const body = await request.json();
  const produit = await modifierProduit(id, body);
  return NextResponse.json(produit);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const acces = await exigerRole(request, ["ADMIN"]);
  if ("erreur" in acces) return acces.erreur;

  const { id } = await params;
  const produit = await archiverProduit(id);
  return NextResponse.json(produit);
}