
export interface UtilisateurRapport {
    /** Identifiant unique de l'utilisateur */
    id: string;

    /** Nom de l'utilisateur */
    nom: string;

    /** Adresse email de l'utilisateur */
    email: string;
}

/**
 * Rapport d'activité généré par l'IA.
 */
export interface Rapport {
    /** Identifiant unique du rapport */
    id: string;

    /** Date de génération du rapport, sérialisée en chaîne ISO */
    dateGeneration: string;

    /** Date de début de la période couverte, sérialisée en chaîne ISO */
    dateDebut: string;

    /** Date de fin de la période couverte, sérialisée en chaîne ISO */
    dateFin: string;

    /** Contenu du rapport au format Markdown, généré par l'IA */
    contenu: string;

    /** Identifiant de l'utilisateur ayant généré le rapport */
    utilisateurId: string;

    /** Utilisateur ayant généré le rapport */
    utilisateur: UtilisateurRapport;
}

/**
 * Version allégée d'un inventaire, utilisée pour peupler
 * une liste déroulante lors d'un export filtré.
 */
export interface InventaireOption {
    /** Identifiant unique de l'inventaire */
    id: string;

    /** Date de lancement de l'inventaire, sérialisée en chaîne ISO */
    dateLancement: string;

    /** Statut actuel de l'inventaire (ex: "EN_COURS", "VALIDE", "ANNULE") */
    statut: string;
}