import { NextRequest, NextResponse } from "next/server";
import { listerVariantes, creerVariante } from "@/lib/services/variante.service";

export async function GET(request: NextRequest) {
    const produitId = request.nextUrl.searchParams.get("produitId") ?? undefined;
    const variantes = await listerVariantes(produitId);
    return NextResponse.json(variantes);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.nomVariante || !body.skuVariante || !body.produitId) {
        return NextResponse.json(
            { error: "nomVariante, skuVariante et produitId sont requis" },
            { status: 400 }
        );
    }

    try {
        const variante = await creerVariante(body);
        return NextResponse.json(variante, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "skuVariante déjà utilisé" }, { status: 409 });
    }
}