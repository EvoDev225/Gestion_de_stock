import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { obtenirVenteParId, annulerVente } from "@/lib/services/vente.service";
import { exigerRole } from "@/lib/auth";
import { serialiserVente } from "@/lib/serializers/vente.serializer";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaAnnulationVente = z
  .object({
    statut: z.literal("ANNULEE"),
  })
  .strip();

export async function GET(
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

    const vente = await obtenirVenteParId(validationId.donnees);
    if (!vente) {
        return NextResponse.json({ error: "Vente introuvable" }, { status: 404 });
    }
    return NextResponse.json(serialiserVente(vente));
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

    const validation = await validerCorps(request, schemaAnnulationVente);
    if (!validation.succes) {
        return validation.erreur;
    }

    const venteExistante = await obtenirVenteParId(validationId.donnees);
    if (!venteExistante) {
        return NextResponse.json({ error: "Vente introuvable" }, { status: 404 });
    }
    if (venteExistante.statut === "ANNULEE") {
        return NextResponse.json({ error: "Cette vente est déjà annulée" }, { status: 403 });
    }
    if (acces.session.role === "EMPLOYEE" && venteExistante.utilisateurId !== acces.session.id) {
        return NextResponse.json(
            { error: "Vous ne pouvez annuler que vos propres ventes" },
            { status: 403 }
        );
    }

    const vente = await annulerVente(validationId.donnees, acces.session.id);
    return NextResponse.json(serialiserVente(vente));
}