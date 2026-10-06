import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listerProduitsAvecStock, creerProduit } from "@/lib/services/produit.service";
import { exigerRole } from "@/lib/auth";
import { validerCorps } from "@/lib/validation";

const schemaCreationProduit = z
  .object({
    nom: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    prixAchat: z.coerce.number().int().min(0),
    prixVente: z.coerce.number().int().min(0),
    seuilMinimum: z.coerce.number().int().min(0).optional(),
    categorieId: z.string().min(1).optional(),
  })
  .strip();

  const schemaFichier = z.object({
    type: z.string().refine(
        (t) => ["image/jpeg", "image/png", "image/webp"].includes(t),
        "Type d'image non supporté (JPEG, PNG ou WebP uniquement)"
    ),
    size: z.number().max(2 * 1024 * 1024, "Image trop lourde (2 Mo maximum)"),
    name: z.string().min(1),
});


export async function GET(request: NextRequest) {
  const acces = await exigerRole(request, ["ADMIN", "EMPLOYEE"]);
  if ("erreur" in acces) return acces.erreur;

  const produits = await listerProduitsAvecStock();
  return NextResponse.json(produits);
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        // ⚠️ Adapte le nom du champ ("file") à celui envoyé par ton frontend
        const fichier = formData.get("file") as File | null;

        if (!fichier) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
        }

        const validation = schemaFichier.safeParse({
            type: fichier.type,
            size: fichier.size,
            name: fichier.name,
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0]?.message ?? "Fichier invalide" },
                { status: 400 }
            );
        }

        // ✅ Conversion en data URL base64 : aucun système de fichiers nécessaire
        const buffer = Buffer.from(await fichier.arrayBuffer());
        const base64 = buffer.toString("base64");
        const dataUrl = `data:${fichier.type};base64,${base64}`;

        return NextResponse.json({ url: dataUrl });
    } catch (error) {
        console.error("Erreur upload:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'enregistrement de l'image" },
            { status: 500 }
        );
    }
}