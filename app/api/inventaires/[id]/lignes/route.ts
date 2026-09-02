import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import { ajouterLigneInventaire } from "@/lib/services/inventaire.service";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const body = await request.json();

    if (!body.produitId) {
        return NextResponse.json({ error: "produitId requis" }, { status: 400 });
    }

    try {
        const ligne = await ajouterLigneInventaire(id, body.produitId, body.varianteId ?? null);
        return NextResponse.json(ligne, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 409 });
    }
}