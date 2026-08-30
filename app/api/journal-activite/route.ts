// app/api/journal-activite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listerJournalActivite } from "@/lib/services/journal-activite.service";
import { exigerRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN"]);
  if ("erreur" in acces) return acces.erreur;

  const utilisateurId = request.nextUrl.searchParams.get("utilisateurId") ?? undefined;
  const journal = await listerJournalActivite(utilisateurId);
  return NextResponse.json(journal);
}