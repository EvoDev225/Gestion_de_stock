import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connecter } from "@/lib/services/auth.service";
import { validerCorps } from "@/lib/validation";

const schemaLogin = z
    .object({
        email: z.string().email().max(254),
        motDePasse: z.string().min(1).max(200),
    })
    .strip();

export async function POST(request: NextRequest) {
    const validation = await validerCorps(request, schemaLogin);

    if (!validation.succes) {
        return validation.erreur;
    }

    const { email, motDePasse } = validation.donnees;

    try {
        const { token, utilisateur } = await connecter(email, motDePasse);

        const response = NextResponse.json({ utilisateur });

        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 401 });
    }
}