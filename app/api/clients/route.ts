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

    if (!body.nom) {
        return NextResponse.json({ error: "nom est requis" }, { status: 400 });
    }

    try {
        const client = await creerClient(body);
        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 });
    }
}