import { NextRequest, NextResponse } from "next/server";
import { obtenirSession } from "@/lib/auth";

const ROUTES_PUBLIQUES = ["/api/auth/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    if (ROUTES_PUBLIQUES.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await obtenirSession(request);

    if (!session) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/api/:path*",
};