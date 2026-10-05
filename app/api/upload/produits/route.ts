export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exigerRole } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const schemaUploadImage = z
  .object({
    type: z.string().startsWith("image/", "Le fichier doit être une image"),
    size: z.number().max(5 * 1024 * 1024, "L'image ne doit pas dépasser 5 Mo"),
    name: z.string().min(1).max(255),
  })
  .strip();

export async function POST(request: NextRequest) {
    // 1. Vérification d'accès : réservé aux administrateurs
    const acces = await exigerRole(request, ["ADMIN"]);
    if ("erreur" in acces) {
        return acces.erreur;
    }

    // 2. Récupération du fichier
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // 3. Validation des métadonnées du fichier avec Zod
    const validationFichier = schemaUploadImage.safeParse({
        type: file.type,
        size: file.size,
        name: file.name,
    });

    if (!validationFichier.success) {
        const premierErreur = validationFichier.error.issues[0];
        return NextResponse.json(
            { error: premierErreur?.message ?? "Fichier invalide" },
            { status: 400 }
        );
    }

    try {
        // 4. Détermination de l'extension
        let extension = path.extname(validationFichier.data.name);
        if (!extension) {
            extension = ".jpg";
        }

        // 5. Génération d'un nom de fichier unique
        const nomFichier = `${randomUUID()}${extension}`;

        // 6. Construction des chemins absolus
        const cheminDossier = path.join(process.cwd(), "public", "uploads", "produits");
        const cheminFichierComplet = path.join(cheminDossier, nomFichier);

        // 7. Création du dossier s'il n'existe pas
        await mkdir(cheminDossier, { recursive: true });

        // 8. Conversion et écriture du fichier sur le disque
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(cheminFichierComplet, buffer);

        // 9. Retour de l'URL publique
        return NextResponse.json({ url: `/uploads/produits/${nomFichier}` }, { status: 201 });
    } catch (error) {
        // 10. Gestion des erreurs
        console.error("Erreur lors de l'enregistrement de l'image :", error);
        return NextResponse.json({ error: "Erreur lors de l'enregistrement de l'image" }, { status: 500 });
    }
}