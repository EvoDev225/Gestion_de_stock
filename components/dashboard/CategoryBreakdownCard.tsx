// components/dashboard/CategoryBreakdownCard.tsx
import { Card } from "@/components/ui/card";

type Categorie = {
    nom: string;
    pourcentage: number;
};

type CategoryBreakdownCardProps = {
    categories: Categorie[];
};

export function CategoryBreakdownCard({ categories }: CategoryBreakdownCardProps) {
    if (categories.length === 0) {
        return null;
    }

    const maxPourcentage = Math.max(...categories.map((c) => c.pourcentage));

    // Trouver les indices du 1er et 2e plus grand pourcentage
    const sortedIndices = categories
        .map((cat, idx) => ({ pourcentage: cat.pourcentage, idx }))
        .sort((a, b) => b.pourcentage - a.pourcentage);

    const premierIdx = sortedIndices[0]?.idx;
    const deuxiemeIdx = sortedIndices[1]?.idx;

    return (
        <Card className="rounded-2xl bg-card p-4">
            <p className="mb-3.5 text-xs text-muted-foreground">
                Répartition par catégorie
            </p>

            <div className="flex h-[90px] items-end gap-2.5">
                {categories.map((categorie, index) => {
                    const hauteur = maxPourcentage > 0
                        ? (categorie.pourcentage / maxPourcentage) * 60
                        : 0;

                    let couleurBarre = "bg-muted border border-border";
                    if (index === premierIdx) {
                        couleurBarre = "bg-primary";
                    } else if (index === deuxiemeIdx) {
                        couleurBarre = "bg-card-foreground";
                    }

                    return (
                        <div
                            key={index}
                            className="flex flex-1 flex-col items-center gap-1.5"
                        >
                            <span className="text-[10px] text-muted-foreground">
                                {categorie.pourcentage}%
                            </span>

                            <div
                                className={`w-full rounded-md ${couleurBarre}`}
                                style={{ height: `${hauteur}px` }}
                            />

                            <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                                {categorie.nom}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}