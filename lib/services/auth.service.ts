import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
const DUREE_SESSION = "7d";

export async function connecter(email: string, motDePasseSaisi: string) {
    const utilisateur = await prisma.utilisateur.findUnique({
        where: { email },
    });

    if (!utilisateur || !utilisateur.actif) {
        throw new Error("Identifiants invalides");
    }

    const motDePasseValide = await bcrypt.compare(motDePasseSaisi, utilisateur.motDePasse);

    if (!motDePasseValide) {
        throw new Error("Identifiants invalides");
    }

    const token = jwt.sign(
        { id: utilisateur.id, role: utilisateur.role, nom: utilisateur.nom },
        JWT_SECRET,
        { expiresIn: DUREE_SESSION }
    );

    return { token, utilisateur: { id: utilisateur.id, nom: utilisateur.nom, role: utilisateur.role } };
}