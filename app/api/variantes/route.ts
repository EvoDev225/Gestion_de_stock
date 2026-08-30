import { NextRequest, NextResponse } from "next/server";
import { listerVariantes, creerVariante } from "@/lib/services/variante.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const produitId = request.nextUrl.searchParams.get("produitId") ?? undefined;
    const variantes = await listerVariantes(produitId);
    return NextResponse.json(variantes);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

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