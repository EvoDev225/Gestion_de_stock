// components/dashboard/VentesDuJourCard.tsx
import { Card } from "@/components/ui/card";
import { formaterDevise } from "@/lib/format";

type VentesDuJourCardProps = {
    montantTotal: number;
    nombre: number;
    devise?: string;
};

export function VentesDuJourCard({
    montantTotal,
    nombre,
    devise = "XOF",
}: VentesDuJourCardProps) {
    const transactionLabel = nombre === 1 ? "transaction" : "transactions";

    return (
        <Card className="rounded-2xl bg-primary p-[18px]">
            <p className="mb-2 text-xs text-primary-foreground opacity-75">
                Ventes du jour
            </p>
            <p className="text-2xl font-medium text-primary-foreground">
                {formaterDevise(montantTotal, devise)}
            </p>
            <p className="mt-1 text-xs text-primary-foreground opacity-75">
                {nombre} {transactionLabel}
            </p>
        </Card>
    );
}