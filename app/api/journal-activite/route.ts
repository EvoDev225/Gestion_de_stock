// app/api/journal-activite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listerJournalActivite } from "@/lib/services/journal-activite.service";

export async function GET(request: NextRequest) {
  const utilisateurId = request.nextUrl.searchParams.get("utilisateurId") ?? undefined;
  const journal = await listerJournalActivite(utilisateurId);
  return NextResponse.json(journal);
}