import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import { genererEtEnregistrerRapport } from "@/lib/services/rapport.service"; // adapte le chemin si besoin

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN"]); // ou ["ADMIN", "EMPLOYEE"] selon ta logique
    if ("erreur" in acces) return acces.erreur;

    try {
        const rapport = await genererEtEnregistrerRapport(acces.session.id);
        return NextResponse.json(rapport, { status: 201 });
    } catch (error) {   
        // On récupère le message réel de l'erreur
        const messageReel = error instanceof Error ? error.message : "Erreur inconnue";
        
        // On logue dans le terminal serveur pour être sûr
        console.error("[API Rapports] Échec détaillé :", messageReel);

        // On renvoie le message réel au frontend (surtout utile en dev)
        return NextResponse.json(
            { 
                erreur: process.env.NODE_ENV === "production" 
                    ? "Une erreur est survenue lors de la génération du rapport." 
                    : messageReel 
            }, 
            { status: 500 }
        );
    }
}