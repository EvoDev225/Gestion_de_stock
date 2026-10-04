import { NextRequest, NextResponse } from "next/server";
import { obtenirSession } from "@/lib/auth";

// Routes accessibles sans session, ouvertes à tous (login public)
const ROUTES_PUBLIQUES = ["/api/auth/login"];

// Routes sans session mais protégées par un autre mécanisme (ex. secret Bearer)
const ROUTES_SANS_SESSION = ["/api/maintenance/reset"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes publiques ou protégées par un secret externe → laisser passer
    if (ROUTES_PUBLIQUES.includes(pathname) || ROUTES_SANS_SESSION.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await obtenirSession(request);

    if (!session) {
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*", "/dashboard/:path*"],
};