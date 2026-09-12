import type { Utilisateur } from "@/types/utilisateur";

export interface ModifierProfilData {
    nom?: string;
    email?: string;
    motDePasseActuel?: string;
    nouveauMotDePasse?: string;
}