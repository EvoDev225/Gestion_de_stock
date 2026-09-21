// app/dashboard/commandes-fournisseur/[id]/page.tsx

import { obtenirSessionServeur } from "@/lib/auth";
import { obtenirCommandeFournisseurParId } from "@/lib/services/commande-fournisseur.service";
import { listerProduits } from "@/lib/services/produit.service";
import { redirect, notFound } from "next/navigation";
import CommandeDetailPageClient from "./CommandeDetailPageClient";
import { serialiserCommande } from "@/lib/serializers/commande-fournisseur";

export default async function CommandeDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await obtenirSessionServeur();

    if (!session) {
        redirect("/login");
    }

    if (session.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const { id } = await params;
const commandeRaw = await obtenirCommandeFournisseurParId(id);

if (!commandeRaw) {
    notFound();
}

const commande = serialiserCommande(commandeRaw);
const produits = await listerProduits();

    return <CommandeDetailPageClient commandeInitiale={commande} produits={produits} />;
}