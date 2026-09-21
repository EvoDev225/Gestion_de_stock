import { obtenirSessionServeur } from "@/lib/auth";
import { listerCommandesFournisseur } from "@/lib/services/commande-fournisseur.service";
import { listerFournisseurs } from "@/lib/services/fournisseur.service";
import { listerProduits } from "@/lib/services/produit.service";
import { redirect } from "next/navigation";
import CommandesPageClient from "./CommandesPageClient";
import { serialiserCommandes } from "@/lib/serializers/commande-fournisseur";
import { serialiserProduitsPourSelection } from "@/lib/serializers/produit-selection";

export default async function CommandesFournisseurPage() {

    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const [commandesRaw, fournisseurs, produitsRaw] = await Promise.all([
        listerCommandesFournisseur(),
        listerFournisseurs(),
        listerProduits(),
    ]);
    const commandes = serialiserCommandes(commandesRaw);
    const produits = serialiserProduitsPourSelection(produitsRaw);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Commandes Fournisseur</h1>
            <CommandesPageClient
                commandesInitiales={commandes}
                fournisseurs={fournisseurs}
                produits={produits}
            />
        </div>
    );
}