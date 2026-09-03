import { NextRequest, NextResponse } from "next/server";
import {
    obtenirCommandeFournisseurParId,
    changerStatutCommande,
    supprimerCommandeFournisseur,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const commande = await obtenirCommandeFournisseurParId(id);

    if (!commande) {
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json(commande);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;
    const { id } = await params;
    const body = await request.json();

    if (body.statut !== "EN_ATTENTE" && body.statut !== "ENVOYEE") {
        return NextResponse.json(
            { error: "Statut invalide. Utilisez EN_ATTENTE ou ENVOYEE ici. RECUE/RECUE_PARTIELLE sont gérés via la réception." },
            { status: 400 }
        );
    }

    const commande = await changerStatutCommande(id, body.statut, acces.session.id);
    return NextResponse.json(commande);
}
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;

    try {
        await supprimerCommandeFournisseur(id, acces.session.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Commande introuvable") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}