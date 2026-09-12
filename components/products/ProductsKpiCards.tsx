import { Package, CheckCircle2, Archive, PackageX } from "lucide-react";

export interface ProductsKpiCardsProps {
    total: number;
    actifs: number;
    archives: number;
    enRupture: number;
}

/**
 * Composant d'affichage des indicateurs clés de performance (KPI) 
 * pour la page des produits et variantes.
 * Utilise exclusivement des tons neutres pour rester cohérent avec le système de design.
 */
export default function ProductsKpiCards({
    total,
    actifs,
    archives,
    enRupture,
}: ProductsKpiCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Carte 1 : Total produits */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                        Total produits
                    </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                    {total}
                </span>
            </div>

            {/* Carte 2 : Produits actifs */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                        Produits actifs
                    </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                    {actifs}
                </span>
            </div>

            {/* Carte 3 : Produits archivés */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                        Produits archivés
                    </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                    {archives}
                </span>
            </div>

            {/* Carte 4 : En rupture de stock */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <PackageX className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                        En rupture de stock
                    </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                    {enRupture}
                </span>
            </div>
        </div>
    );
}