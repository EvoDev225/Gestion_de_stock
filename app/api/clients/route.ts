import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerClients, creerClient } from "@/lib/services/client.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationClient = z
  .object({
    nom: z.string().trim().min(1).max(200),
    telephone: z.string().trim().min(1).max(50),
    email: z.union([z.literal(""), z.string().email().max(254)]).optional(),
    adresse: z.string().max(500).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const clients = await listerClients();
    return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
    const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
    if ("erreur" in acces) return acces.erreur;

    const validation = await validerCorps(request, schemaCreationClient);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { nom, telephone, email, adresse } = validation.donnees;

    try {
        const client = await creerClient({
            nom,
            telephone,
            email,
            adresse,
            utilisateurId: acces.session.id,
        });
        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur lors de la création";
        const statut = message.toLowerCase().includes("email") ? 409 : 400;
        return NextResponse.json({ error: message }, { status: statut });
    }
}