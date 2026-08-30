import { NextRequest, NextResponse } from "next/server";
import { listerLots, creerLot } from "@/lib/services/lot.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const produitId = request.nextUrl.searchParams.get("produitId") ?? undefined;
    const varianteId = request.nextUrl.searchParams.get("varianteId") ?? undefined;
    const lots = await listerLots(produitId, varianteId);
    return NextResponse.json(lots);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.numeroLot || !body.dateExpiration || body.quantite === undefined || !body.dateReception) {
        return NextResponse.json(
            { error: "numeroLot, dateExpiration, quantite et dateReception sont requis" },
            { status: 400 }
        );
    }

    try {
        const lot = await creerLot({
            ...body,
            dateExpiration: new Date(body.dateExpiration),
            dateReception: new Date(body.dateReception),
        });
        return NextResponse.json(lot, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}