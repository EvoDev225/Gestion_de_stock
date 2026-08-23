import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

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