import { NextRequest, NextResponse } from "next/server";

const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX_OCTETS = 2 * 1024 * 1024; // 2 Mo

// Valide une data URL base64 et retourne un message d'erreur si problème
function validerDataUrl(dataUrl: string): string | null {
    const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl);
    if (!match) {
        return "Format d'image invalide (JPEG, PNG ou WebP attendu)";
    }
    const octets = Math.floor((match[2].length * 3) / 4);
    if (octets > TAILLE_MAX_OCTETS) {
        return "Image trop lourde (2 Mo maximum)";
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get("content-type") ?? "";

        // ✅ CAS 1 : le frontend envoie l'image en JSON (data URL base64)
        if (contentType.includes("application/json")) {
            const body = await request.json().catch(() => null);
            const dataUrl: unknown = body?.image ?? body?.imageUrl ?? body?.url;

            if (typeof dataUrl !== "string" || !dataUrl) {
                return NextResponse.json(
                    { error: "Aucune image reçue dans le corps JSON" },
                    { status: 400 }
                );
            }

            const probleme = validerDataUrl(dataUrl);
            if (probleme) {
                return NextResponse.json({ error: probleme }, { status: 400 });
            }

            return NextResponse.json({ url: dataUrl });
        }

        // ✅ CAS 2 : envoi classique en multipart/form-data
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { error: "Type de contenu non supporté (multipart/form-data ou application/json attendu)" },
                { status: 415 }
            );
        }

        const formData = await request.formData();
        const fichier =
            (formData.get("file") as File | null) ??
            (formData.get("image") as File | null) ??
            (formData.get("photo") as File | null);

        if (!fichier) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
        }

        if (!TYPES_AUTORISES.includes(fichier.type)) {
            return NextResponse.json(
                { error: "Type d'image non supporté (JPEG, PNG ou WebP uniquement)" },
                { status: 400 }
            );
        }

        if (fichier.size > TAILLE_MAX_OCTETS) {
            return NextResponse.json({ error: "Image trop lourde (2 Mo maximum)" }, { status: 400 });
        }

        const buffer = Buffer.from(await fichier.arrayBuffer());
        const dataUrl = `data:${fichier.type};base64,${buffer.toString("base64")}`;

        return NextResponse.json({ url: dataUrl });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Erreur upload:", error);
        return NextResponse.json(
            { error: `Erreur lors de l'enregistrement de l'image : ${message}` },
            { status: 500 }
        );
    }
}