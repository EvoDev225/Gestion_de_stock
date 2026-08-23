import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type SessionPayload = {
    id: string;
    role: "ADMIN" | "EMPLOYEE";
    nom: string;
};

export async function obtenirSession(request: NextRequest): Promise<SessionPayload | null> {
    const token = request.cookies.get("session")?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}

export async function exigerRole(
    request: NextRequest,
    rolesAutorises: ("ADMIN" | "EMPLOYEE")[]
): Promise<{ session: SessionPayload } | { erreur: NextResponse }> {
    const session = await obtenirSession(request);

    if (!session) {
        return { erreur: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
    }

    if (!rolesAutorises.includes(session.role)) {
        return { erreur: NextResponse.json({ error: "Accès refusé" }, { status: 403 }) };
    }

    return { session };
}