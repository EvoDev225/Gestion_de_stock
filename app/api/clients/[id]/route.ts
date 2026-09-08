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
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;

    try {
        const client = await obtenirClientParId(id);
        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;
    const body = await request.json();

    try {
        const client = await modifierClient(id, {
            ...body,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(client);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur lors de la modification";
        const statut = message.toLowerCase().includes("introuvable")
            ? 404
            : message.toLowerCase().includes("email")
            ? 409
            :400;
        return NextResponse.json({ error: message }, { status: statut });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id } = await params;

    try {
        await supprimerClient(id, acces.session.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Suppression impossible";
        const statut = message.toLowerCase().includes("introuvable") ? 404 : 409;
        return NextResponse.json({ error: message }, { status: statut });
    }
}