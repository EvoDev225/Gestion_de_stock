import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    obtenirClientParId,
    modifierClient,
    supprimerClient,
} from "@/lib/services/client.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationClient = z
  .object({
    nom: z.string().trim().min(1).max(200).optional(),
    telephone: z.string().trim().min(1).max(50).optional(),
    email: z.union([z.literal(""), z.string().email().max(254)]).optional(),
    adresse: z.string().max(500).optional(),
  })
  .strip();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) {
        return validationId.erreur;
    }

    try {
        const client = await obtenirClientParId(validationId.donnees);
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

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) {
        return validationId.erreur;
    }

    const validation = await validerCorps(request, schemaModificationClient);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { nom, telephone, email, adresse } = validation.donnees;

    try {
        const client = await modifierClient(validationId.donnees, {
            nom,
            telephone,
            email,
            adresse,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(client);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur lors de la modification";
        const statut = message.toLowerCase().includes("introuvable")
            ? 404
            : message.toLowerCase().includes("email")
            ? 409
            : 400;
        return NextResponse.json({ error: message }, { status: statut });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { id: idBrut } = await params;
    const validationId = validerParametre(idBrut, schemaId);
    if (!validationId.succes) {
        return validationId.erreur;
    }

    try {
        await supprimerClient(validationId.donnees, acces.session.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Suppression impossible";
        const statut = message.toLowerCase().includes("introuvable") ? 404 : 409;
        return NextResponse.json({ error: message }, { status: statut });
    }
}