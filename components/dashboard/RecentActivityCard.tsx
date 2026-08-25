// components/dashboard/RecentActivityCard.tsx
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";

type RecentActivityCardProps = {
    resume: string;
};

export function RecentActivityCard({ resume }: RecentActivityCardProps) {
    return (
        <Card className="rounded-2xl bg-card p-4">
            <div className="mb-2.5 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Activité récente</span>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">{resume}</p>
        </Card>
    );
}