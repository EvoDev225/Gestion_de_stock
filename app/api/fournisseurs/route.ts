import { NextRequest, NextResponse } from "next/server";
import { listerFournisseurs, creerFournisseur } from "@/lib/services/fournisseur.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const fournisseurs = await listerFournisseurs();
    return NextResponse.json(fournisseurs);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.nom || !body.telephone || !body.adresse) {
        return NextResponse.json(
            { error: "nom, telephone et adresse sont requis" },
            { status: 400 }
        );
    }

    try {
        const fournisseur = await creerFournisseur(body);
        return NextResponse.json(fournisseur, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}