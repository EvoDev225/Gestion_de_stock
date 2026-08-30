import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import {
    obtenirFournisseurParId,
    modifierFournisseur,
    supprimerFournisseur,
} from "@/lib/services/fournisseur.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const fournisseur = await obtenirFournisseurParId(id);

    if (!fournisseur) {
        return NextResponse.json({ error: "Fournisseur introuvable" }, { status: 404 });
    }

    return NextResponse.json(fournisseur);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const body = await request.json();
    const fournisseur = await modifierFournisseur(id, body);
    return NextResponse.json(fournisseur);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;

    try {
        await supprimerFournisseur(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Suppression impossible : ce fournisseur a des commandes liées" },
            { status: 409 }
        );
    }
}