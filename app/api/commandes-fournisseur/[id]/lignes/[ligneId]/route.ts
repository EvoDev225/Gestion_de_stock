import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    modifierLigneCommande,
    supprimerLigneCommande,
} from "@/lib/services/commande-fournisseur.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps, validerParametre } from "@/lib/validation";

const schemaLigneId = z.string().min(1);

const schemaModificationLigneCommande = z
  .object({
    quantiteCommande: z.coerce.number().int().min(1).optional(),
    prixAchatUnitaire: z.coerce.number().int().min(1).optional(),
  })
  .strip();

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; ligneId: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { ligneId: ligneIdBrut } = await params;
    const validationLigneId = validerParametre(ligneIdBrut, schemaLigneId);
    if (!validationLigneId.succes) {
        return validationLigneId.erreur;
    }

    const validation = await validerCorps(request, schemaModificationLigneCommande);
    if (!validation.succes) {
        return validation.erreur;
    }

    const { quantiteCommande, prixAchatUnitaire } = validation.donnees;

    try {
        const ligne = await modifierLigneCommande(
            validationLigneId.donnees,
            { quantiteCommande, prixAchatUnitaire },
            acces.session.id
        );
        return NextResponse.json(ligne);
    } catch (error: any) {
        if (error.message === "Ligne introuvable") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; ligneId: string }> }
) {
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) return acces.erreur;

    const { ligneId: ligneIdBrut } = await params;
    const validationLigneId = validerParametre(ligneIdBrut, schemaLigneId);
    if (!validationLigneId.succes) {
        return validationLigneId.erreur;
    }

    try {
        await supprimerLigneCommande(validationLigneId.donnees, acces.session.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Ligne introuvable") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}