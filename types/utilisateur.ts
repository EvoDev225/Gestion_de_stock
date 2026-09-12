export type RoleUtilisateur = "ADMIN" | "EMPLOYEE";

export interface Utilisateur {
    id: string;
    nom: string;
    email: string;
    role: RoleUtilisateur;
    actif: boolean;
    dateCreation: string;
}

export interface NouvelUtilisateurData {
    nom: string;
    email: string;
    motDePasse: string;
    role: RoleUtilisateur;
}