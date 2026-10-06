import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp"];
const TAILLE_MAX = 2 * 1024 * 1024; // 2 Mo

const schemaFichier = z.object({
    type: z.string().refine(
        (t) => TYPES_AUTORISES.includes(t),
        "Type d'image non supporté (JPEG, PNG ou WebP uniquement)"
    ),
    size: z.number().max(TAILLE_MAX, "Image trop lourde (2 Mo maximum)"),
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // ✅ Accepte les noms de champ courants côté frontend
        const fichier =
            (formData.get("file") as File | null) ??
            (formData.get("image") as File | null) ??
            (formData.get("photo") as File | null);

        if (!fichier) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
        }

        const validation = schemaFichier.safeParse({
            type: fichier.type,
            size: fichier.size,
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0]?.message ?? "Fichier invalide" },
                { status: 400 }
            );
        }

        // ✅ AUCUNE écriture disque : conversion en data URL base64
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