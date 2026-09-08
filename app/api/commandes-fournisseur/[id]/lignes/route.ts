import { NextRequest, NextResponse } from "next/server";
import { ajouterLigneCommande } from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const body = await request.json();

    if (!body.produitId || !body.quantiteCommande || !body.prixAchatUnitaire) {
        return NextResponse.json(
            { error: "produitId, quantiteCommande et prixAchatUnitaire sont requis" },
            { status: 400 }
        );
    }

    try {
        const ligne = await ajouterLigneCommande(id, body, acces.session.id);
        return NextResponse.json(ligne, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2003") {
            return NextResponse.json({ error: "Produit introuvable" }, { status: 400 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}