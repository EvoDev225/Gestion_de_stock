// components/dashboard/WatchlistBar.tsx
import { Card } from "@/components/ui/card";
import { AlertTriangle, CircleCheck } from "lucide-react";

type Produit = {
    nom: string;
    info: string;
    statut: "seuil_bas" | "peremption" | "ok";
};

type WatchlistBarProps = {
    produits: Produit[];
};

function StatutIcon({ statut }: { statut: Produit["statut"] }) {
    if (statut === "ok") {
        return <CircleCheck className="h-3.5 w-3.5 text-primary" />;
    }
    return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
}

export function WatchlistBar({ produits }: WatchlistBarProps) {
    return (
        <Card className="rounded-2xl bg-card px-4.5 py-3.5">
            <div className="flex items-center gap-6">
                <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                    À surveiller
                </span>

                {produits.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                        Aucune alerte active
                    </span>
                ) : (
                    <div
                        className="flex items-center gap-2 overflow-x-auto"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <div className="flex items-center gap-6 overflow-x-auto scrollbar-width:none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
    {/* ... contenu existant ... */}
</div>
                        {produits.map((produit, index) => (
                            <div
                                key={index}
                                className="flex shrink-0 items-center gap-2 whitespace-nowrap"
                            >
                                <StatutIcon statut={produit.statut} />
                                <span className="text-xs text-card-foreground">
                                    {produit.nom}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {produit.info}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}