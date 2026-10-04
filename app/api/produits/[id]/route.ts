import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  obtenirProduitParId,
  modifierProduit,
  archiverProduit,
} from "@/lib/services/produit.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationProduit = z
  .object({
    nom: z.string().min(1).max(200).optional(),
    sku: z.string().min(1).max(100).optional(),
    description: z.string().max(2000).optional(),
    prixAchat: z.coerce.number().int().min(0).optional(),
    prixVente: z.coerce.number().int().min(0).optional(),
    seuilMinimum: z.coerce.number().int().min(0).optional(),
    categorieId: z.string().min(1).optional(),
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

  const produit = await obtenirProduitParId(validationId.donnees);

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

  const { id: idBrut } = await params;
  const validationId = validerParametre(idBrut, schemaId);

  if (!validationId.succes) {
    return validationId.erreur;
  }

  const validation = await validerCorps(request, schemaModificationProduit);

  if (!validation.succes) {
    return validation.erreur;
  }

  const produit = await modifierProduit(validationId.donnees, validation.donnees);
  return NextResponse.json(produit);
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

  const produit = await archiverProduit(validationId.donnees);
  return NextResponse.json(produit);
}