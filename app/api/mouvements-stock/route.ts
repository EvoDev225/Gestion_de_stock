import { NextRequest, NextResponse } from "next/server";
import { listerMouvementsStock } from "@/lib/services/mouvement-stock.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const produitId = request.nextUrl.searchParams.get("produitId") ?? undefined;
    const varianteId = request.nextUrl.searchParams.get("varianteId") ?? undefined;

    const mouvements = await listerMouvementsStock({ produitId, varianteId });
    return NextResponse.json(mouvements);
}