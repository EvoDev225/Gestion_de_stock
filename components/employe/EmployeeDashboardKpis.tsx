import { Receipt, Wallet, PackageX } from "lucide-react";
import { formaterPrixFCFA } from "@/lib/utils/format-currency";

interface EmployeeDashboardKpisProps {
  nombreVentesDuJour: number;
  montantVentesDuJour: number;
  produitsEnRupture: number;
}

/**
 * Affiche les indicateurs clés de performance du tableau de bord employé
 * Composant serveur - pas d'état ni d'interactivité
 */
export default function EmployeeDashboardKpis({
  nombreVentesDuJour,
  montantVentesDuJour,
  produitsEnRupture,
}: EmployeeDashboardKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Carte : Ventes aujourd'hui */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Ventes aujourd'hui
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground">
          {nombreVentesDuJour}
        </div>
      </div>

      {/* Carte : Montant du jour */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Montant du jour
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground">
          {formaterPrixFCFA(montantVentesDuJour)}
        </div>
      </div>

      {/* Carte : Produits en rupture */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <PackageX className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Produits en rupture
          </span>
        </div>
        <div className="text-2xl font-bold text-foreground">
          {produitsEnRupture}
        </div>
      </div>
    </div>
  );
}