// app/api/journal-activite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerJournalActivite } from "@/lib/services/journal-activite.service";
import { exigerRole } from "@/lib/auth";
import { validerQuery } from "@/lib/validation";

const schemaListeJournalActivite = z
  .object({
    utilisateurId: z.string().min(1).optional(),
  })
  .strip();

export async function GET(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN"]);
  if ("erreur" in acces) return acces.erreur;

  const validation = validerQuery(request, schemaListeJournalActivite);
  if (!validation.succes) {
    return validation.erreur;
  }

  const { utilisateurId } = validation.donnees;
  const journal = await listerJournalActivite(utilisateurId);
  return NextResponse.json(journal);
}