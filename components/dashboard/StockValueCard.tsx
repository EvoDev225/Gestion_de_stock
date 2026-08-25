// components/dashboard/StockValueCard.tsx
import { Card } from "@/components/ui/card";

type StockValueCardProps = {
    valeurStock: number;
    devise?: string;
};

function formaterDevise(valeur: number, codeDevise: string = "XOF"): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: codeDevise,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valeur);
}

export function StockValueCard({ valeurStock, devise = "XOF" }: StockValueCardProps) {
    return (
        <Card className="rounded-2xl bg-card p-4.5">
            <p className="mb-2 text-xs text-muted-foreground">Valeur totale du stock</p>
            <p className="text-2xl font-medium text-card-foreground">
                {formaterDevise(valeurStock, devise)}
            </p>
        </Card>
    );
}