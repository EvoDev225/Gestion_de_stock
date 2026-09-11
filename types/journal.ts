
export interface UtilisateurActivite {
    id: string;
    nom: string;
}


export interface Activite {
    id: string;
    action: string;
    entiteConcerneeType: string | null;
    entiteConcerneeId: string | null;
    details: string | null;
    dateAction: string;
    utilisateurId: string;
    utilisateur: UtilisateurActivite;
}