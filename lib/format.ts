// lib/format.ts
export function formaterDevise(
    valeur: number,
    codeDevise: string = "XOF"
): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: codeDevise,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valeur);
}