import { Prisma } from "@/generated/prisma/client";

type CommandeAvecRestant = Awaited<ReturnType<typeof import("@/lib/services/commande-fournisseur.service").obtenirCommandeFournisseurParId>>;

export function serialiserCommande(commande: any): CommandeFournisseur {
    return {
        id: commande.id,
        dateCommande: commande.dateCommande.toISOString(),
        statut: commande.statut,
        fournisseurId: commande.fournisseurId,
        utilisateurId: commande.utilisateurId,
        fournisseur: {
            id: commande.fournisseur.id,
            nom: commande.fournisseur.nom,
            email: commande.fournisseur.email,
            telephone: commande.fournisseur.telephone,
            adresse: commande.fournisseur.adresse,
        },
        ligneCommandeFournisseur: commande.ligneCommandeFournisseur.map((ligne: any) => ({
            id: ligne.id,
            quantiteCommande: Number(ligne.quantiteCommande),
            prixAchatUnitaire: Number(ligne.prixAchatUnitaire),
            quantiteRecue: ligne.quantiteRecue ?? undefined,
            commandeFournisseurId: ligne.commandeFournisseurId,
            produitId: ligne.produitId,
            produit: {
                id: ligne.produit.id,
                nom: ligne.produit.nom,
                sku: ligne.produit.sku,
            },
        })),
    };
}

export function serialiserCommandes(commandes: any[]): CommandeFournisseur[] {
    return commandes.map(serialiserCommande);
}