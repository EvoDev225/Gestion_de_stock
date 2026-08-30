import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import {
    obtenirValeurStock,
    obtenirRepartitionParCategorie,
    obtenirProduitsASurveiller,
    obtenirVentesDuJour,
    obtenirCommandesEnAttente,
    obtenirActiviteRecente,
} from "@/lib/services/statistiques/dashboard.service";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const [
        valeurStock,
        repartitionCategories,
        produitsASurveiller,
        ventesDuJour,
        commandesEnAttente,
        activiteRecente,
    ] = await Promise.all([
        obtenirValeurStock(),
        obtenirRepartitionParCategorie(),
        obtenirProduitsASurveiller(),
        obtenirVentesDuJour(),
        obtenirCommandesEnAttente(),
        obtenirActiviteRecente(),
    ]);

    return NextResponse.json({
        valeurStock,
        repartitionCategories,
        produitsASurveiller,
        ventesDuJour,
        commandesEnAttente,
        activiteRecente,
    });
}