import { NextRequest, NextResponse } from "next/server";
import {
    modifierLigneCommande,
    supprimerLigneCommande,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; ligneId: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { ligneId } = await params;
    const body = await request.json();

    try {
        const ligne = await modifierLigneCommande(ligneId, body, acces.session.id);
        return NextResponse.json(ligne);
    } catch (error: any) {
        if (error.message === "Ligne introuvable") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; ligneId: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { ligneId } = await params;

    try {
        await supprimerLigneCommande(ligneId, acces.session.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Ligne introuvable") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}