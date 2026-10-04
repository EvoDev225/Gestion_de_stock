import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export type ResultatValidation<T> =
    | { succes: true; donnees: T }
    | { succes: false; erreur: NextResponse };

function genererErreur400(message: string, details?: unknown): NextResponse {
    const corps: { error: string; details?: unknown } = {
        error: message,
    };

    if (details !== undefined && process.env.NODE_ENV !== "production") {
        corps.details = details;
    }

    return NextResponse.json(corps, { status: 400 });
}

export async function validerCorps<T>(
    request: Request,
    schema: ZodType<T>
): Promise<ResultatValidation<T>> {
    let corps: unknown;

    try {
        corps = await request.json();
    } catch {
        return {
            succes: false,
            erreur: genererErreur400("Corps JSON invalide."),
        };
    }

    const resultat = schema.safeParse(corps);

    if (!resultat.success) {
        return {
            succes: false,
            erreur: genererErreur400("Données invalides.", resultat.error.issues),
        };
    }

    return {
        succes: true,
        donnees: resultat.data,
    };
}

export function validerParametre<T>(
    valeur: unknown,
    schema: ZodType<T>
): ResultatValidation<T> {
    const resultat = schema.safeParse(valeur);

    if (!resultat.success) {
        return {
            succes: false,
            erreur: genererErreur400("Paramètre invalide.", resultat.error.issues),
        };
    }

    return {
        succes: true,
        donnees: resultat.data,
    };
}

export function validerQuery<T>(
    request: Request,
    schema: ZodType<T>
): ResultatValidation<T> {
    const url = new URL(request.url);
    const valeursBrutes = Object.fromEntries(url.searchParams.entries());

    const resultat = schema.safeParse(valeursBrutes);

    if (!resultat.success) {
        return {
            succes: false,
            erreur: genererErreur400(
                "Paramètres de requête invalides.",
                resultat.error.issues
            ),
        };
    }

    return {
        succes: true,
        donnees: resultat.data,
    };
}