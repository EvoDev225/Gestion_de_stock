import { NextRequest, NextResponse } from "next/server";
import {
    obtenirCategorieParId,
    modifierCategorie,
    supprimerCategorie,
} from "@/lib/services/categorie.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const categorie = await obtenirCategorieParId(id);

    if (!categorie) {
        return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }

    return NextResponse.json(categorie);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const body = await request.json();
    const categorie = await modifierCategorie(id, body);
    return NextResponse.json(categorie);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
        if ("erreur" in acces) return acces.erreur;
    const { id } = await params;

    try {
        await supprimerCategorie(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 409 }
        );
    }
}