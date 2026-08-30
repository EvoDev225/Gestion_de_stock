import { NextRequest, NextResponse } from "next/server";
import { listerCategories, creerCategorie } from "@/lib/services/categorie.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const categories = await listerCategories();
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.nom) {
        return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const categorie = await creerCategorie(body);
    return NextResponse.json(categorie, { status: 201 });
}