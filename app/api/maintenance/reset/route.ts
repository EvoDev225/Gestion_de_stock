import { NextRequest, NextResponse } from "next/server";
import { remettreBaseAZero } from "@/lib/services/reset.service";

// La remise à zéro est une opération sensible : jamais ouverte.
// Deux façons de prouver le droit :
// - appel manuel (curl) avec RESET_SECRET
// - cron Vercel, qui envoie automatiquement CRON_SECRET
async function traiterReset(request: NextRequest) {
  const secretManuel = process.env.RESET_SECRET;
  const secretCron = process.env.CRON_SECRET;

  if (!secretManuel && !secretCron) {
    return NextResponse.json(
      { error: "Remise à zéro non configurée (RESET_SECRET absent)" },
      { status: 503 }
    );
  }

  const autorisation = request.headers.get("authorization");
  const autorise =
    (secretManuel !== undefined && autorisation === `Bearer ${secretManuel}`) ||
    (secretCron !== undefined && autorisation === `Bearer ${secretCron}`);

  if (!autorise) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const resultat = await remettreBaseAZero();
    return NextResponse.json({
      succes: true,
      tablesVidees: resultat.tablesVidees.length,
      comptesRecrees: resultat.comptesRecrees,
    });
  } catch (error) {
    console.error("Erreur lors de la remise à zéro :", error);
    return NextResponse.json(
      { error: "Erreur lors de la remise à zéro de la base" },
      { status: 500 }
    );
  }
}

// POST = appel manuel (curl)
export async function POST(request: NextRequest) {
  return traiterReset(request);
}

// GET = appel du cron Vercel (le scheduler appelle en GET)
export async function GET(request: NextRequest) {
  return traiterReset(request);
}