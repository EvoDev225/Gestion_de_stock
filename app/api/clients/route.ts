import { NextRequest, NextResponse } from "next/server";
import { listerClients, creerClient } from "@/lib/services/client.service";

export async function GET() {
    const clients = await listerClients();
    return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
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