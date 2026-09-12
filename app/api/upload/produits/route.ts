export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { exigerRole } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

    // 3. Validation du type MIME
    if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Le fichier doit être une image" }, { status: 400 });
    }

    // 4. Validation de la taille (limite à 5 Mo)
    const tailleMax = 5 * 1024 * 1024;
    if (file.size > tailleMax) {
        return NextResponse.json({ error: "L'image ne doit pas dépasser 5 Mo" }, { status: 400 });
    }

    try {
        // 5. Détermination de l'extension
        let extension = path.extname(file.name);
        if (!extension) {
            extension = ".jpg";
        }

        // 6. Génération d'un nom de fichier unique
        const nomFichier = `${randomUUID()}${extension}`;

        // 7. Construction des chemins absolus
        const cheminDossier = path.join(process.cwd(), "public", "uploads", "produits");
        const cheminFichierComplet = path.join(cheminDossier, nomFichier);

        // 8. Création du dossier s'il n'existe pas
        await mkdir(cheminDossier, { recursive: true });

        // 9. Conversion et écriture du fichier sur le disque
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(cheminFichierComplet, buffer);

        // 10. Retour de l'URL publique
        return NextResponse.json({ url: `/uploads/produits/${nomFichier}` }, { status: 201 });
    } catch (error) {
        // 11. Gestion des erreurs
        console.error("Erreur lors de l'enregistrement de l'image :", error);
        return NextResponse.json({ error: "Erreur lors de l'enregistrement de l'image" }, { status: 500 });
    }
}