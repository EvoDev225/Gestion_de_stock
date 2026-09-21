import { obtenirSessionServeur } from "@/lib/auth";
import { listerVentes } from "@/lib/services/vente.service";
import { listerProduitsAvecStock } from "@/lib/services/produit.service";
import EmployeeDashboardKpis from "@/components/employe/EmployeeDashboardKpis";
import EmployeeDashboardProduitsRecents from "@/components/employe/EmployeeDashboardProduitsRecents";
import { redirect } from "next/navigation";

/**
 * Page du tableau de bord pour les employés.
 * Ce Server Component récupère les données, calcule les indicateurs agrégés
 * et les transmet au composant d'affichage sans exposer les objets bruts.
 */
export default async function EmployeeDashboardPage() {
    // 1. Récupération de la session et filet de sécurité minimal
    const session = await obtenirSessionServeur();
    if (!session) {
        redirect("/login");
    }

    // 2. Récupération de toutes les ventes
    const toutesLesVentes = await listerVentes();

    // 3. Calcul de la date du jour à minuit (début de journée) pour le filtrage
    const debutJournee = new Date();
    debutJournee.setHours(0, 0, 0, 0);

    // 4. Filtrage des ventes du jour appartenant à l'utilisateur connecté (hors annulées)
    const ventesDuJourUtilisateur = toutesLesVentes.filter(
        (vente) =>
            vente.utilisateurId === session.id &&
            vente.statut !== "ANNULEE" &&
            new Date(vente.dateVente) >= debutJournee
    );

    // 5. Calcul du nombre et du montant total des ventes du jour
    // Conversion explicite du type Decimal Prisma en number avant sommation
    const nombreVentesDuJour = ventesDuJourUtilisateur.length;
    const montantVentesDuJour = ventesDuJourUtilisateur.reduce(
        (total, vente) => total + Number(vente.montantTotal),
        0
    );

    // 6. Récupération des produits avec leur stock calculé
    const produits = await listerProduitsAvecStock();

    // 7. Comptage des produits actifs (non archivés) en rupture de stock
    const produitsEnRupture = produits.filter(
        (produit) => !produit.archive && produit.stockCalcule === 0
    ).length;

    // 8. Préparation de la liste des 10 produits les plus récents (non archivés)
    const produitsRecents = produits
        .filter((produit) => !produit.archive)
        .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
        .slice(0, 10)
        .map((produit) => ({
            id: produit.id,
            nom: produit.nom,
            sku: produit.sku,
            prixVente: Number(produit.prixVente),
            stockCalcule: produit.stockCalcule,
            seuilMinimum: produit.seuilMinimum,
        }));

    // 9. Rendu de la page avec transmission exclusive des valeurs agrégées
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bonjour {session.nom}, voici votre activité du jour.
                </p>
            </div>
            <EmployeeDashboardKpis
                nombreVentesDuJour={nombreVentesDuJour}
                montantVentesDuJour={montantVentesDuJour}
                produitsEnRupture={produitsEnRupture}
            />
            <EmployeeDashboardProduitsRecents produits={produitsRecents} />
        </div>
    );
}