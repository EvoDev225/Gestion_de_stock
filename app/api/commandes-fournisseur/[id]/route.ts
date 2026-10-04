import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    obtenirCommandeFournisseurParId,
    changerStatutCommande,
    supprimerCommandeFournisseur,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaId = z.string().min(1);

const schemaModificationStatut = z
  .object({
    statut: z.string().refine(
      (val) => val === "EN_ATTENTE" || val === "ENVOYEE",
      { message: "Statut invalide. Utilisez EN_ATTENTE ou ENVOYEE ici. RECUE/RECUE_PARTIELLE sont gérés via la réception." }
    ),
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

    const commande = await obtenirCommandeFournisseurParId(validationId.donnees);

    if (!commande) {
        return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json(commande);
}

export async function PATCH(
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

    const validation = await validerCorps(request, schemaModificationStatut);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { statut } = validation.donnees;

    const commande = await changerStatutCommande(
        validationId.donnees,
        statut as "EN_ATTENTE" | "ENVOYEE",
        acces.session.id
    );
    return NextResponse.json(commande);
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
        await supprimerCommandeFournisseur(validationId.donnees, acces.session.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Commande introuvable") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}