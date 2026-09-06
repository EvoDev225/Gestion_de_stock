// lib/serializers/commande-fournisseur.ts
import type { CommandeFournisseur } from "@/types/commande-fournisseur";

export function serialiserCommande(commande: any): CommandeFournisseur {
    return {
        ...commande,
        dateCommande: commande.dateCommande.toISOString(),
        ligneCommandeFournisseur: commande.ligneCommandeFournisseur.map((ligne: any) => ({
            ...ligne,
            quantiteCommande: Number(ligne.quantiteCommande),
            prixAchatUnitaire: Number(ligne.prixAchatUnitaire),
        })),
    };
}

export function serialiserCommandes(commandes: any[]): CommandeFournisseur[] {
    return commandes.map(serialiserCommande);
}