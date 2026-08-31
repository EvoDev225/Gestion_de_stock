// app/api/dashboard/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth"; // adapte le chemin exact si différent
import {
    obtenirNombreProduitsEnStock,
    obtenirProduitsASurveiller,
    obtenirVentesDuMois,
    obtenirCommandesEnAttente,
    obtenirEvolutionVentes,
    obtenirActionsEnAttente,
} from "@/lib/services/statistiques/dashboard.service"; // adapte le chemin exact

export async function GET(request: NextRequest) {
    const resultat = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in resultat) {
        return NextResponse.json({ erreur: resultat.erreur }, { status: 403 });
    }

    const [
        produitsEnStock,
        alertes,
        ventesDuMois,
        commandesEnAttente,
        evolutionVentes,
        actions,
    ] = await Promise.all([
        obtenirNombreProduitsEnStock(),
        obtenirProduitsASurveiller(),
        obtenirVentesDuMois(),
        obtenirCommandesEnAttente(),
        obtenirEvolutionVentes(7),
        obtenirActionsEnAttente(),
    ]);

    return NextResponse.json({
        stats: {
            produitsEnStock,
            alertesRupture: alertes.length,
            ventesDuMois,
            commandesEnAttente,
        },
        evolutionVentes: evolutionVentes.map((jour) => ({
            date: jour.date,
            montant: jour.montantTotal,
        })),
        actions,
    });
}