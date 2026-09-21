import { formaterPrixFCFA } from "@/lib/utils/format-currency";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export interface EmployeeDashboardProduitsRecentsProps {
    produits: {
        id: string;
        nom: string;
        sku: string;
        prixVente: number;
        stockCalcule: number;
        seuilMinimum: number;
    }[];
}

/**
 * Affiche un tableau des produits les plus récents sur le tableau de bord employé.
 * Composant serveur - affichage seul, sans état ni interactivité.
 */
export default function EmployeeDashboardProduitsRecents({
    produits,
}: EmployeeDashboardProduitsRecentsProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Produits récents</h2>
                <Link href="/dashboard/employe/products" className="text-sm text-primary hover:underline">
                    Voir tout
                </Link>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase">
                        <tr>
                            <th className="py-3 px-6">Nom &amp; SKU</th>
                            <th className="py-3 px-6">Prix de vente</th>
                            <th className="py-3 px-6">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produits.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                                    Aucun produit trouvé
                                </td>
                            </tr>
                        ) : (
                            produits.map((produit) => (
                                <tr
                                    key={produit.id}
                                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="py-3 px-6">
                                        <div className="font-semibold text-sm text-foreground">
                                            {produit.nom}
                                        </div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            SKU: {produit.sku}
                                        </div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className="text-sm font-semibold text-primary">
                                            {formaterPrixFCFA(produit.prixVente)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">
                                        {produit.stockCalcule === 0 ? (
                                            <span className="bg-destructive/10 text-destructive rounded-full px-2.5 py-1 text-xs">
                                                Rupture
                                            </span>
                                        ) : produit.stockCalcule <= produit.seuilMinimum ? (
                                            <span className="bg-amber-500/10 text-amber-600 rounded-full px-2.5 py-1 text-xs inline-flex items-center gap-1">
                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                {produit.stockCalcule}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                {produit.stockCalcule}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}