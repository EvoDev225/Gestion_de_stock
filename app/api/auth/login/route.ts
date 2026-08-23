import { NextRequest, NextResponse } from "next/server";
import { connecter } from "@/lib/services/auth.service";

export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.email || !body.motDePasse) {
        return NextResponse.json(
            { error: "email et motDePasse sont requis" },
            { status: 400 }
        );
    }

    try {
        const { token, utilisateur } = await connecter(body.email, body.motDePasse);

        const response = NextResponse.json({ utilisateur });

        response.cookies.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 jours, en secondes
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 401 });
    }
}