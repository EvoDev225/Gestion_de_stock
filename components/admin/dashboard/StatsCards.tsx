import { Package, AlertTriangle, Euro, Clock } from "lucide-react";

export interface StatsCardsProps {
    stats: {
        produitsEnStock: number;
        alertesRupture: number;
        ventesDuMois: number; // en euros
        commandesEnAttente: number;
    };
    isLoading?: boolean;
}

export default function StatsCards({ stats, isLoading = false }: StatsCardsProps) {
    // Formatage des nombres en français
    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("fr-FR").format(value);
    };

    // Formatage de la devise en euros
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Stat 1 : Produits en stock */}
            {/* Note : Utilisation de notre classe utilitaire "corner-brackets corner-brackets-tl-br" sur la première carte */}
            <div className="bg-card p-6 rounded-[24px] ambient-shadow corner-brackets corner-brackets-tl-br relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Package className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Produits en stock
                    </h3>
                </div>
                {isLoading ? (
                    <div className="h-8 w-28 bg-muted animate-pulse rounded-md" />
                ) : (
                    <p className="text-3xl font-bold text-foreground">
                        {formatNumber(stats.produitsEnStock)}
                    </p>
                )}
            </div>

            {/* Stat 2 : Alertes de rupture */}
            <div className="bg-card p-6 rounded-[24px] ambient-shadow relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Alertes de rupture
                    </h3>
                </div>
                {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
                ) : (
                    <p
                        className={`text-3xl font-bold ${stats.alertesRupture > 0 ? "text-destructive" : "text-foreground"
                            }`}
                    >
                        {formatNumber(stats.alertesRupture)}
                    </p>
                )}
            </div>

            {/* Stat 3 : Ventes du mois */}
            <div className="bg-card p-6 rounded-[24px] ambient-shadow relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Euro className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Ventes du mois
                    </h3>
                </div>
                {isLoading ? (
                    <div className="h-8 w-32 bg-muted animate-pulse rounded-md" />
                ) : (
                    <p className="text-3xl font-bold text-foreground">
                        {formatCurrency(stats.ventesDuMois)}
                    </p>
                )}
            </div>

            {/* Stat 4 : Commandes en attente */}
            <div className="bg-card p-6 rounded-[24px] ambient-shadow relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-warning/10 rounded-lg text-warning">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Commandes en attente
                    </h3>
                </div>
                {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
                ) : (
                    <p className="text-3xl font-bold text-warning">
                        {formatNumber(stats.commandesEnAttente)}
                    </p>
                )}
            </div>
        </div>
    );
}