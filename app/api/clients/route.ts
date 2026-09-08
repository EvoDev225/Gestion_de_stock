import { NextRequest, NextResponse } from "next/server";
import { listerClients, creerClient } from "@/lib/services/client.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const clients = await listerClients();
    return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const body = await request.json();

    if (!body.nom || body.nom.trim() === "") {
        return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    if (!body.telephone || body.telephone.trim() === "") {
        return NextResponse.json(
            { error: "Le téléphone est requis pour assurer la traçabilité" },
            { status: 400 }
        );
    }

    try {
        const client = await creerClient({
            ...body,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur lors de la création";
        const statut = message.toLowerCase().includes("email") ? 409 : 400;
        return NextResponse.json({ error: message }, { status: statut });
    }
}