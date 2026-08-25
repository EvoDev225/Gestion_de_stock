import { NextRequest, NextResponse } from "next/server";
import { obtenirSession } from "@/lib/auth";
import {
    obtenirValeurStock,
    obtenirRepartitionParCategorie,
    obtenirProduitsASurveiller,
    obtenirVentesDuJour,
    obtenirCommandesEnAttente,
    obtenirActiviteRecente,
} from "@/lib/services/statistiques/dashboard.service";

export async function GET(request: NextRequest) {
    const session = await obtenirSession(request);
    if (!session) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

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