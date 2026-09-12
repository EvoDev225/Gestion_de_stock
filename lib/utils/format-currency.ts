/**
 * Formate un montant en Franc CFA (FCFA).
 * Le montant est arrondi à l'entier le plus proche et formaté avec un espace
 * comme séparateur de milliers, suivi du suffixe " FCFA".
 *
 * @param montant - Le montant à formater (nombre ou chaîne de caractères).
 * @returns Une chaîne de caractères représentant le montant formaté en FCFA.
 */
export function formaterPrixFCFA(montant: number | string): string {
    const nombre = typeof montant === "string" ? Number(montant) : montant;

    if (Number.isNaN(nombre)) {
        return "0 FCFA";
    }

    const entierArrondi = Math.round(nombre);
    const montantFormate = entierArrondi.toLocaleString("fr-FR");

    return `${montantFormate} FCFA`;
}