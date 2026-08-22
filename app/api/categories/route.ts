import { NextRequest, NextResponse } from "next/server";
import { listerCategories, creerCategorie } from "@/lib/services/categorie.service";

export async function GET() {
    const categories = await listerCategories();
    return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.nom) {
        return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const categorie = await creerCategorie(body);
    return NextResponse.json(categorie, { status: 201 });
}