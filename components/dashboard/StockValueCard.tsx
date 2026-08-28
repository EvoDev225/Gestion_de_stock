// components/dashboard/StockValueCard.tsx
import { Card } from "@/components/ui/card";
import { formaterDevise } from "@/lib/format";

type StockValueCardProps = {
    valeurStock: number;
    devise?: string;
};

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