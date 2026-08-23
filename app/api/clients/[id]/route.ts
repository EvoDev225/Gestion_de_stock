import { NextRequest, NextResponse } from "next/server";
import {
    obtenirClientParId,
    modifierClient,
    supprimerClient,
} from "@/lib/services/client.service";
import { exigerRole } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const client = await obtenirClientParId(id);

    if (!client) {
        return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    return NextResponse.json(client);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const client = await modifierClient(id, body);
    return NextResponse.json(client);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
        if ("erreur" in acces) return acces.erreur;
    const { id } = await params;

    try {
        await supprimerClient(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Suppression impossible : ce client a des ventes liées" },
            { status: 409 }
        );
    }
}