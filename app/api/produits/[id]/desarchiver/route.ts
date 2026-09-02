import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth"; // ajuste le chemin selon ton projet
import { desarchiverProduit } from "@/lib/services/produit.service";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const produit = await desarchiverProduit(id);
    return NextResponse.json(produit);
}